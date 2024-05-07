import React from 'react'
import HeaderForDevItFreelancer from '../../../Components/BeforeLoginComponents/HeaderForDevITFreelancer'
import "./DevelopmentItFreelancer.css"
import freelancerMainSectionArticle1DevIT from '../../../assets/img/talent-main-section-article1-Dev-IT.png'
import freelancerMainSectionArticle2DevIT from '../../../assets/img/talent-main-section-article2-Dev-IT.png'
import freelancermainsectionarticle2MaskGroupDevIT from '../../../assets/img/talent-main-section-article2-Mask-Group-Dev-IT.svg'
import freelancerMainSectionFillDevIT from '../../../assets/img/talent_main-section-Fill-Dev-IT.svg'
import freelancerMainSectionArticle2MobileDevIT from '../../../assets/img/talent-main-section-article2-mobile-Dev-IT.png'
import ArticleCard from '../../../Components/BeforeLoginComponents/ArticleCard'
import BusinessTrusted from '../../../Components/BeforeLoginComponents/BusinessTrusted'
import TrustedRemote from '../../../Components/BeforeLoginComponents/TrustedRemote'
import BrowseBuyProjects from '../../../Components/BeforeLoginComponents/BrowseBuyProjects'
import GetStarted from '../../../Components/BeforeLoginComponents/GetStarted'
import PlayingField from '../../../Components/BeforeLoginComponents/PlayingField'
import ProjectExamples from '../../../Components/BeforeLoginComponents/ProjectExamples'
import Flexera from '../../../Components/BeforeLoginComponents/Flexera'
import Questions from '../../../Components/BeforeLoginComponents/Questions'
import FindSkills from '../../../Components/BeforeLoginComponents/FindSkills'
import Header from '../../../Components/BeforeLoginComponents/Header'
import Footer from '../../../Components/BeforeLoginComponents/Footer'


export default function DevelopmentItFreelancer() {
    return (
        <div>
            <Header />
            <HeaderForDevItFreelancer />
            <section className="container" id="main-section-ID">
                <div className="row position-relative" id="article-section-ID">
                    <div className="row position-absolute d-lg-flex d-none justify-content-evenly me-3 ms-3" id="articles-ID">
                        <div className="col-5 d-lg-inline-block d-none px-5 py-4 rounded-3" id="article-ID">
                            <ArticleCard image={freelancerMainSectionArticle1DevIT} header="Freelancer that’s rated, reviewed, and ready" content="Find proven developers, engineers, IT professionals, and more." />
                        </div>
                        <div className="col-5 d-lg-inline-block d-none px-5 py-4 rounded-3" id="article-ID">
                            <ArticleCard image={freelancerMainSectionArticle2DevIT} header="Scale up, down, sideways, and smarter" content="Find support for any scope, from one-off jobs to complex
                initiatives." />
                        </div>
                        <img src={freelancermainsectionarticle2MaskGroupDevIT} className="col-1 position-absolute" id="left-bg-article-image-ID" alt='' />
                        <img src={freelancerMainSectionFillDevIT} className="col-1 position-absolute" id="right-bg-article-image-ID" alt='' />
                    </div>
                    <div className="position-absolute d-lg-none" id="mobile-articles-ID">
                        <img className="w-50 mx-auto d-block" id="mobile-articles-image-ID" src={freelancerMainSectionArticle2MobileDevIT} alt='' />
                    </div>
                </div>

                <BusinessTrusted />
                <TrustedRemote />
                <BrowseBuyProjects />
                <GetStarted />
                <PlayingField />
                <ProjectExamples />
                <Flexera />
                <Questions />
                <FindSkills />
            </section>
            <Footer />
        </div>
    )
}
