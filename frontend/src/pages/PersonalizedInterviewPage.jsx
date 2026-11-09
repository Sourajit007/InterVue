import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PersonalizedInterviewModal from '../components/PersonalizedInterviewModal';

export const PersonalizedInterviewPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Header
        title="Resume-Based Personalized Interview"
        subtitle="Upload your resume to let AI create a personalized interview based on your skills, education, projects and experience"
      />

      <PersonalizedInterviewModal
        isOpen={true}
        onClose={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default PersonalizedInterviewPage;

