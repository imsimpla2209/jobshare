export const fakeFreelancerState = {
  firstName: "John",
  lastName: "Doe",
  profilePhoto: "https://example.com/profile.jpg",
  location: {
    city: "New York",
    country: "USA"
  },
  email: "john@example.com",
  title: "Web Developer",
  overview: "Experienced web developer with expertise in React and Node.js.",
  company: [
    {
      companyName: "ABC Inc.",
      jobTitle: "Front-end Developer",
      stillWork: false
    },
    {
      companyName: "XYZ Corp.",
      jobTitle: "Full-stack Developer",
      stillWork: true
    }
  ],
  savedJobs: [],
  education: {
    school: "University of XYZ",
    areaOfStudy: "Computer Science",
    degree: "Bachelor's Degree",
    gradYear: "2015"
  },
  englishProficiency: "Fluent",
  otherLanguages: [
    {
      language: "Spanish",
      langProf: "Intermediate"
    },
    {
      language: "French",
      langProf: "Basic"
    }
  ],
  hourlyRate: 50,
  jobCategory: "Web Development",
  expertiseLevel: "Intermediate",
  accepted: false,
  totalEarnings: 1000,
  profileCompletion: 69,
  authID: '420ent',
  skills: [
    'Hút cần',
    'Bay bổng'
  ],
  badge: null,
  user: 69,
  availability: true,
  connects: 69,
  otherExperience: [],
};

export const fakeClientState = {
  firstName: "John",
  lastName: "Doe",
  profilePhoto: "https://example.com/profile.jpg",
  location: {
    city: "New York",
    country: "USA"
  },
  title: "Web Developer",
  overview: "Experienced web developer with expertise in React and Node.js.",
  company: [
    {
      companyName: "ABC Inc.",
      jobTitle: "Front-end Developer",
      stillWork: false
    },
    {
      companyName: "XYZ Corp.",
      jobTitle: "Full-stack Developer",
      stillWork: true
    }
  ],
  education: {
    school: "University of XYZ",
    areaOfStudy: "Computer Science",
    degree: "Bachelor's Degree",
    gradYear: "2015"
  },
  englishProficiency: "Fluent",
  otherLanguages: [
    {
      language: "Spanish",
      langProf: "Intermediate"
    },
    {
      language: "French",
      langProf: "Basic"
    }
  ],
  hourlyRate: 50,
  jobCategory: "Web Development",
  expertiseLevel: "Intermediate",
  accepted: false,
  spentMoney: 1000,
  profileCompletion: 250,
  authID: '420ent',
  skills: [
    'Hút cần',
    'Bay bổng'
  ],
  review: [],
  paymentVerified: true,
  badge: null,
  user: 69,
  availability: true,
  connects: 69,
  savedFreelancers: [],
};

export const fakeJobsState = [
  {
    jobID: "23231sadsada",
    jobTitle: "Web Developer",
    jobCategory: "Web Development",
    jobDescription: "Looking for a skilled web developer to work on a project.",
    postTime: { seconds: 1633622400 },
    jobExperienceLevel: "Intermediate",
    jobPaymentType: "Fixed Price",
    jobDuration: "3 months",
    skills: ["HTML", "CSS", "JavaScript"],
    docID: '444442222',
    status: true,
    jobBudget: 6969,
    clientPaymentVerified: true,
    clientCountry: 'Thank Hoas',
    clientAllReviews: [],
    clientSpentMoney: 999,
    freelancerJobReview: [{review: "nhuw cais dau b"}],    clientJobReview: [{review: "nhuw cais dau b"}],
    data: [],
  },
  {
    jobID: "2321sadsada",
    jobTitle: "Graphic Designer",
    jobCategory: "Design",
    jobDescription: "Seeking a talented graphic designer for a creative project.",
    postTime: { seconds: 1633622400 },
    jobExperienceLevel: "Expert",
    jobPaymentType: "Hourly",
    jobDuration: "6 months",
    skills: ["Adobe Photoshop", "Illustrator", "UI/UX Design"],
    docID: '444444442',
    status: true,
    jobBudget: 6969,
    clientPaymentVerified: true,
    clientCountry: 'Thank Hoas',
    clientAllReviews: [],
    clientSpentMoney: 999,
    freelancerJobReview: [{review: "nhuw cais dau b"}],    clientJobReview: [{review: "nhuw cais dau b"}],
    data: []

  },
  {
    jobID: "2321sadsada1",
    jobTitle: "Content Writer",
    jobCategory: "Writing",
    jobDescription: "Hiring a content writer for blog and article writing.",
    postTime: { seconds: 1633622400 },
    jobExperienceLevel: "Entry Level",
    jobPaymentType: "Fixed Price",
    jobDuration: "1 month",
    skills: ["Content Writing", "SEO", "Copywriting"],
    docID: '444442221',
    status: true,
    jobBudget: 6969,
    clientPaymentVerified: true,
    clientCountry: 'Thank Hoas',
    clientAllReviews: [],
    clientSpentMoney: 999,
    freelancerJobReview: [{review: "nhuw cais dau b"}],    clientJobReview: [{review: "nhuw cais dau b"}],
    data: []

  },
];

export const fakeOfferData = {
  jobTitle: "Web Developer Project",
  jobBudget: 1000,
  jobPaymentType: "Fixed Price",
  dueDate: "2023-12-31",
  contractId: "123456",
};