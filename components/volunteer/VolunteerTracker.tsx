import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/contexts/AuthContext';

export function VolunteerTracker() {
  const { user } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplication();
    }
  }, [user]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!application) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Application Status
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            application.status === 'pending' ? 'bg-yellow-400' :
            application.status === 'approved' ? 'bg-green-400' :
            'bg-red-400'
          }`} />
          <span className="capitalize">{application.status}</span>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Selected Programs</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {application.interests.map((interest: string) => (
              <span
                key={interest}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Skills</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {application.skills.map((skill: string) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
