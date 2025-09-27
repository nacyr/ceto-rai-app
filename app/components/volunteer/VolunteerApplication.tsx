import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/app/lib/supabase';

export function VolunteerApplication() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    skills: [] as string[],
    availability: '',
    interests: [] as string[],
    experience: '',
    motivation: ''
  });

  const availabilityOptions = [
    'Weekdays', 'Weekends', 'Evenings', 'Flexible'
  ];

  const skillOptions = [
    'Teaching', 'Healthcare', 'Administration',
    'Technology', 'Fundraising', 'Event Planning'
  ];

  const programInterests = [
    'Education Support', 'Healthcare Outreach',
    'Women Empowerment', 'Humanitarian Aid'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('volunteers')
        .insert({
          user_id: user.id,
          ...formData,
          status: 'pending'
        });

      if (error) throw error;
      // Show success message and redirect
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Skills</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {skillOptions.map(skill => (
            <label key={skill} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.skills.includes(skill)}
                onChange={(e) => {
                  const update = e.target.checked
                    ? [...formData.skills, skill]
                    : formData.skills.filter(s => s !== skill);
                  setFormData({ ...formData, skills: update });
                }}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Availability</h3>
        <select
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="">Select availability</option>
          {availabilityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Program Interests</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {programInterests.map(program => (
            <label key={program} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.interests.includes(program)}
                onChange={(e) => {
                  const update = e.target.checked
                    ? [...formData.interests, program]
                    : formData.interests.filter(p => p !== program);
                  setFormData({ ...formData, interests: update });
                }}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2">{program}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Experience</h3>
        <textarea
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          rows={4}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Tell us about your relevant experience..."
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Motivation</h3>
        <textarea
          value={formData.motivation}
          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          rows={4}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Why do you want to volunteer with us?"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      >
        Submit Application
      </button>
    </form>
  );
}
