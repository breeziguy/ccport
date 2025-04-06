import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserProfile } from './types';

export const supabase = createClientComponentClient();

export const getProfileCompletionPercentage = (profile: Partial<UserProfile>): number => {
  // Define required fields and their weights
  const fields = [
    { name: 'name', weight: 20, required: true },
    { name: 'contact_person_phone', weight: 15, required: true },
    { name: 'contact_person_address', weight: 15, required: true },
    { name: 'entity_type', weight: 20, required: true },
    { name: 'contact_person_name', weight: 10, required: false },
    { name: 'image_url', weight: 5, required: false }
  ];

  // Calculate percentage
  let totalWeight = 0;
  let completedWeight = 0;

  fields.forEach(field => {
    if (field.required) {
      totalWeight += field.weight;
      
      // Check if the field is completed
      if (
        profile[field.name as keyof Partial<UserProfile>] !== null && 
        profile[field.name as keyof Partial<UserProfile>] !== undefined &&
        profile[field.name as keyof Partial<UserProfile>] !== ''
      ) {
        completedWeight += field.weight;
      }
    } else if (
      profile[field.name as keyof Partial<UserProfile>] !== null && 
      profile[field.name as keyof Partial<UserProfile>] !== undefined &&
      profile[field.name as keyof Partial<UserProfile>] !== ''
    ) {
      // For non-required fields, only add to total if they're completed
      totalWeight += field.weight;
      completedWeight += field.weight;
    }
  });

  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

export async function getUser() {
  try {
    // Check if user is authenticated via Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log("Auth error or no user:", authError);
      return { user: null, error: authError?.message || 'Not authenticated' };
    }
    
    try {
      console.log("Fetching client profile for user:", user.id);
      
      // Get client profile data from the client table (not clients)
      const { data: clientData, error: clientError } = await supabase
        .from('client')
        .select('*')
        .eq('id', user.id)
        .single();
        
      // Handle profile error or missing data
      if (clientError) {
        console.error('Error fetching client data:', clientError.message, clientError.code);
        
        // If this is a first-time user (client doesn't exist yet), create a basic one
        if (clientError.code === 'PGRST116' || clientError.message.includes('does not exist')) {
          // For database structure issues, just return auth user without redirecting to profile completion
          if (clientError.message.includes('does not exist')) {
            console.log('Client table does not exist - returning basic user');
            return { 
              user: { 
                id: user.id, 
                email: user.email || '',
                name: user.user_metadata?.name || '',
                profile_completed: true, // Prevent profile completion redirect
                completion_percentage: 100
              } as UserProfile, 
              error: null 
            };
          }
          
          console.log('Creating new client record for auth user:', user.id);
          
          try {
            const { data: newClient, error: insertError } = await supabase
              .from('client')
              .insert({
                id: user.id,
                name: user.user_metadata?.name || '',
                contact_person_name: user.user_metadata?.name || '',
                contact_person_email: user.email || '',
                contact_person_phone: user.user_metadata?.phone || '',
                contact_person_address: '',
                entity_type: '',
                status: 'active'
              })
              .select()
              .single();
              
            if (insertError) {
              console.error('Error creating client record:', insertError);
              // Still allow access without redirection
              return { 
                user: { 
                  id: user.id, 
                  email: user.email || '',
                  name: user.user_metadata?.name || '',
                  profile_completed: true, // Prevent completion redirect 
                  completion_percentage: 100
                } as UserProfile, 
                error: null 
              };
            }
            
            // Return the newly created client record with completion data
            const completionPercentage = getProfileCompletionPercentage(newClient || {});
            
            const mappedClient = mapClientToUserProfile(newClient || {}, user.email || '');
            
            // New users need to complete their profile
            return { 
              user: { 
                ...mappedClient,
                profile_completed: false,
                completion_percentage: completionPercentage
              }, 
              error: null 
            };
          } catch (insertErr) {
            console.error('Error in client creation:', insertErr);
            return { 
              user: { 
                id: user.id, 
                email: user.email || '',
                name: user.user_metadata?.name || '',
                profile_completed: true, // Prevent completion redirect
                completion_percentage: 100
              } as UserProfile, 
              error: null
            };
          }
        }
        
        // For other errors, still return user without profile completion redirect
        return { 
          user: { 
            id: user.id, 
            email: user.email || '',
            name: user.user_metadata?.name || '',
            profile_completed: true, // Prevent completion redirect
            completion_percentage: 100
          } as UserProfile, 
          error: null
        };
      }
      
      // Handle the case where client data is null
      if (!clientData) {
        console.log('Client data is null for user:', user.id);
        return { 
          user: { 
            id: user.id, 
            email: user.email || '',
            name: user.user_metadata?.name || '',
            profile_completed: true, // Prevent completion redirect
            completion_percentage: 100
          } as UserProfile, 
          error: null
        };
      }
      
      // Combine auth and client data
      const profile = clientData;
      const completionPercentage = getProfileCompletionPercentage(profile);
      
      // Map the client data to our UserProfile type
      const mappedClient = mapClientToUserProfile(profile, user.email || '');
      
      // Check if profile is considered complete - needs basic fields and entity_type
      // Only enforce profile completion if entity_type field exists in the database
      let profileComplete = true; // Default to complete
      
      if (
        'entity_type' in profile && 
        'contact_person_phone' in profile && 
        'contact_person_address' in profile
      ) {
        profileComplete = Boolean(
          profile.name && 
          profile.contact_person_phone && 
          profile.contact_person_address &&
          profile.entity_type
        );
      }
      
      return {
        user: {
          ...mappedClient,
          profile_completed: profileComplete,
          completion_percentage: completionPercentage
        },
        error: null,
      };
    } catch (profileError) {
      console.error('Error processing client data:', profileError);
      
      // Return basic user info without profile completion redirect
      return { 
        user: { 
          id: user.id, 
          email: user.email || '',
          name: user.user_metadata?.name || '',
          profile_completed: true, // Prevent completion redirect
          completion_percentage: 100
        } as UserProfile, 
        error: null
      };
    }
  } catch (error) {
    console.error('Error in getUser:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

// Helper function to map database client fields to our UserProfile type
function mapClientToUserProfile(client: any, email: string): UserProfile {
  return {
    id: client.id,
    email: client.contact_person_email || email,
    name: client.name || '',
    phone: client.contact_person_phone || '',
    address: client.contact_person_address || '',
    avatar_url: client.image_url || '',
    client_type: client.entity_type || '',
    company_name: client.entity_type === 'company' ? client.name : '',
    profile_completed: false, // This will be calculated by the caller
    completion_percentage: 0, // This will be calculated by the caller
    created_at: client.created_at,
    updated_at: client.updated_at
  };
}

export async function updateProfile(profile: Partial<UserProfile>) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Map our UserProfile fields to the client table fields
    const clientData: any = {
      name: profile.name,
      contact_person_phone: profile.phone,
      contact_person_address: profile.address,
      contact_person_email: profile.email,
      image_url: profile.avatar_url,
    };
    
    // Set entity_type if provided
    if (profile.client_type) {
      clientData.entity_type = profile.client_type;
      
      // If it's a company, set the company name as the name
      if (profile.client_type === 'company' && profile.company_name) {
        clientData.name = profile.company_name;
      }
    }
    
    // First check if the client record exists
    const { data: existingClient, error: checkError } = await supabase
      .from('client')
      .select('id')
      .eq('id', user.id)
      .single();
      
    if (checkError && checkError.code === 'PGRST116') {
      // Client record doesn't exist, create it
      const { error: insertError } = await supabase
        .from('client')
        .insert({
          id: user.id,
          ...clientData,
          status: 'active'
        });
        
      if (insertError) {
        console.error('Error creating client record:', insertError);
        return { success: false, error: insertError.message };
      }
      
      return { success: true, error: null };
    }
    
    // Client record exists, update it
    const { error } = await supabase
      .from('client')
      .update(clientData)
      .eq('id', user.id);
      
    if (error) {
      console.error('Error updating client record:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
} 