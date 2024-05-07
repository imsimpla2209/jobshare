export const FERoutes = {
  allProposals: '/proposals/',
  allContract: '/all-contract',
  myJobs: '/my-jobs',
  allInvitation: '/invitations',
  allMessages: '/messages',
  jobDetail: '/job/',
}

export const FEMessage = (extra?: any) => {
  return {
    createProposal: {
      name: `Your Posted got a new proposal for the job: ${extra}`,
      name_vi: `Công việc của bạn vừa nhận được 1 proposal mới tới công việc: ${extra}`,
    },
    inProgressProposal: {
      name: `The owner of job(${extra}) which you applied wants to talk to you directly`,
      name_vi: `Khách hàng của Công việc( ${extra}) mà bạn đã nộp proposal muốn trao đổi trực tiếp với bạn`,
    },
    rejectProposalDueJobDeleted: {
      name: `The job: ${extra} you applied is deleted by owner and you got a you will be refunded the jobsPoints used to create the proposal`,
      name_vi: `Công việc: ${extra} bạn nộp đơn đã bị chủ sở hữu xóa và bạn nhận được công việc, bạn sẽ được hoàn lại số jobsPoints đã dùng để tạo đề xuất`,
    },
    rejectProposal: {
      name: `The owner of job: ${extra} | rejects your proposal`,
      name_vi: `Chủ sở hữu công việc: ${extra} | từ chối đề xuất của bạn`,
    },
    acceptRequest: {
      name: 'Your Request Message has been accepted',
      name_vi: 'Yêu cầu giao tiếp trực tiếp của bạn đã được chấp thuận',
    },
    rejectRequest: {
      name: 'Your Request Message has been reject',
      name_vi: 'Yêu cầu giao tiếp trực tiếp của bạn đã bị từ chối',
    },
    createContract: {
      name: 'You got a new contract',
      name_vi: 'Bạn vừa nhận được 1 đề nghị hợp đồng mới',
    },
    requestMessage: {
      name: `You got a new request direct message from ${extra}`,
      name_vi: `Bạn vừa nhận được 1 đề nghị trò chuyện trực tiếp từ ${extra}`,
    },
    gotJob: {
      name: 'You just got a new Job bro, work now',
      name_vi: 'Bạn vừa nhận được 1 công việc mới, bro. Triển luôn và ngay',
    },
    acceptContract: {
      name: 'Your proposed contract has been accepted',
      name_vi: 'Đề nghị hợp đồng làm việc của bạn đã được đồng thuận',
    },
    rejectContract: {
      name: 'Your proposed contract has been rejected',
      name_vi: 'Đề nghị hợp đồng làm việc của bạn đã bị từ chối',
    },
    newJobCreated: {
      name: 'One of you favorite client just posted a new job',
      name_vi: '1 trong những khách hàng bạn ưa thích vừa đăng 1 công việc mới',
    },
    jobVerified: {
      name: `Congratulations! your job ${extra} was successfully verified`,
      name_vi: `Xin chúc mừng! công việc ${extra} của bạn đã được xác minh thành công`,
    },
    profileVerified: {
      name: `Congragulation! your profile is entirely verified. Reload page to enjoy our platform now`,
      name_vi: `Xin chúc mừng! hồ sơ cá nhân của bạn đã được phê duyệt. Tải lại trang để thưởng thức nền tảng ngay bây giờ`,
    },
    jobsPointsChange: {
      name: `The Sick Points Prices and Cost has changed`,
      name_vi: `Chi phí và giá thành của Sick Points cho các dịch vụ đã thay đổi`,
    },
    phoneSMSVerify: `JobSickers-Biggest Application Marketplace \n\nYour OTP verification code is/Mã xác thực số điện thoại của bạn là [ ${extra} ]`,
  }
}
