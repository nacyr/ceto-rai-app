'use client';

import TeamMemberProfile from '@/app/components/PagesComponents/TeamMemberProfile';
import { teamMembers } from '@/mockData/teamMembers';
import { useParams } from 'next/navigation';

export default function TeamMemberPage() {
  const { id } = useParams(); // Next.js 15 hook
  const member = teamMembers.find((m) => m.id === id);

  if (!member) {
    return <div className="p-8 text-center">Member not found.</div>;
  }

  return <TeamMemberProfile member={member} />;
}
