import React from 'react';
import ProposalForm from '@/components/ProposalForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <ProposalForm />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Index;
