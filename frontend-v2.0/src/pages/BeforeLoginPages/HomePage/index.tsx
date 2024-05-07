import React from 'react'
import Header from '../../../Components/BeforeLoginComponents/Header';
import Footer from '../../../Components/BeforeLoginComponents/Footer';
import HomeFirstSection from 'Components/BeforeLoginComponents/HomeFirstSection';
import HomeFourthSection from 'Components/BeforeLoginComponents/HomeFourthSection';
import HomeSecondSection from 'Components/BeforeLoginComponents/HomeSecondSection';
import HomeThirdSection from 'Components/BeforeLoginComponents/HomeThirdSection';

export default function HomePage() {
    return (
        <div className="bg-white">
            <Header />
            <HomeFirstSection />
            <HomeSecondSection />
            <HomeThirdSection />
            <HomeFourthSection />
            <Footer />
        </div>
    )
}
