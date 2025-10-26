'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, User } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { aboutMockData } from '@/mockData/about'
import { teamMembers as mockTeam } from '@/mockData/teamMembers'
import type { AboutData } from '@/app/types/types'

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData>(aboutMockData)
  const [team, setTeam] = useState(mockTeam)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- Fetch About page content ---
        const { data: aboutRows, error: aboutError } = await supabase
          .from('about_page')
          .select('*')
          .limit(1)
          .single()

        // --- Fetch Values ---
        const { data: valuesRows } = await supabase
          .from('about_values')
          .select('*')

        // --- Fetch Team ---
        const { data: teamRows, error: teamError } = await supabase
          .from('team_members')
          .select('*')

        // If everything fetched correctly
        if (!aboutError && aboutRows) {
          setAboutData({
            hero: {
              title: aboutRows.hero_title || aboutMockData.hero.title,
              subtitle: aboutRows.hero_subtitle || aboutMockData.hero.subtitle,
              backgroundImage:
                aboutRows.hero_background || aboutMockData.hero.backgroundImage,
            },
            story: {
              title: aboutRows.story_title || aboutMockData.story.title,
              paragraphs:
                aboutRows.story_paragraphs || aboutMockData.story.paragraphs,
            },
            values:
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              valuesRows?.map((v: any) => ({
                icon: Heart, // You can map icons if stored as strings
                title: v.title,
                description: v.description,
              })) || aboutMockData.values,
          })
        }

        // Fallback if Supabase not available or empty
        if (!teamError && teamRows?.length > 0) {
          setTeam(teamRows)
        }
      } catch (err) {
        console.warn('⚠️ Using fallback mock data due to error:', err)
        setAboutData(aboutMockData)
        setTeam(mockTeam)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="relative py-24 bg-center bg-cover bg-no-repeat text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${aboutData.hero.backgroundImage}')`,
        }}
      >
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {aboutData.hero.title}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {aboutData.hero.subtitle}
          </p>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              {aboutData.story.title}
            </h2>
            {aboutData.story.paragraphs.map((para, index) => (
              <p
                key={index}
                className="text-lg text-gray-600 mb-6 leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>
          {/* <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
              <Heart className="w-32 h-32 text-teal-600/30" />
            </div>
          </div> */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-teal-50 to-white">
          <div
            className="flex animate-scroll-slow"
            style={{
              width: 'max-content',
              animation: 'scroll 20s linear infinite',
            }}
          >
            {['group1.jpg', 'group2.jpg','adamu.jpeg','maryam.jpeg', 'nasiru.jpg', 'sani1.jpg'].map((img, index) => (
              <div key={index} className="flex-shrink-0 w-64 h-64 relative m-4 rounded-xl overflow-hidden">
                <Image
                  src={`/images/team/${img}`}
                  alt={`Team member ${index + 1}`}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            ))}
          </div>

          {/* Gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>

        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {aboutData.values.map((value, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated individuals leading our mission to create
              lasting change in communities.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {team.map((member: any) => (
              <Link
                key={member.id}
                href={`/about/${member.id}`}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs text-center p-6 bg-gray-50 rounded-xl hover:bg-teal-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-teal-600 mx-auto" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-teal-600">{member.role}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
