import React from 'react';
import ContactClient from '../components/ContactClient';

export const metadata = {
  title: 'Contact Us | RGJobs',
  description: 'Get in touch with the RGJobs team. We are here to help with your job search or hiring needs in India and worldwide.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <ContactClient />
    </main>
  );
}
