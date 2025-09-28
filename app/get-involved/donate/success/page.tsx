'use client'

import { useEffect, useState } from 'react';
import DonationSuccessPage from '@/app/components/PagesComponents/DonationSuccessPage';
import { DonationData } from '@/app/types/types';

export default function SuccessPage() {
  const [donationData, setDonationData] = useState<DonationData | null>(null);

  useEffect(() => {
    // Retrieve donation data from sessionStorage
    const storedData = sessionStorage.getItem('donationSuccess');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setDonationData(parsedData);
        
        // Clear the data after retrieving it (optional)
        // sessionStorage.removeItem('donationSuccess');
      } catch (error) {
        console.error('Error parsing donation data:', error);
      }
    }
  }, []);

  return (
    <DonationSuccessPage
      donationAmount={donationData?.amount}
      donorName={donationData?.donorName}
    />
  );
}
// 'use client'

// import DonationSuccessPage from '@/app/components/PagesComponents/DonationSuccessPage';
// import { DonationData } from '@/app/types/types';
// import { useEffect, useState } from 'react';



// export default function SuccessPage() {
//   const [donationData, setDonationData] = useState<DonationData | null>(null);

//   useEffect(() => {
//     // Retrieve donation data from sessionStorage
//     const storedData = sessionStorage.getItem('donationSuccess');
//     if (storedData) {
//       try {
//         const parsedData = JSON.parse(storedData);
//         setDonationData(parsedData);
        
//         // Clear the data after retrieving it
//         sessionStorage.removeItem('donationSuccess');
//       } catch (error) {
//         console.error('Error parsing donation data:', error);
//       }
//     }
//   }, []);

//   return (
//     <DonationSuccessPage
//       redirectDelay={10} // 10 seconds countdown
//       redirectTo="/donate" // Redirect back to donation page
//       donationAmount={donationData?.amount}
//       donorName={donationData?.donorName}
//     />
//   );
// }