export enum EStatus {
  PENDING = 'pending',
  INPROGRESS = 'inProgress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  PAID = 'paid',
  LATE = 'late',
  ARCHIVE = 'archive',
}

export enum EJobStatus {
  PENDING = 'pending',
  DRAFT = 'draft',
  PRIVATE = 'private',
  INPROGRESS = 'inProgress',
  COMPLETED = 'completed',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  OPEN = 'open',
}

export enum ELevel {
  BEGINNER = 0,
  INTERMEDIATE = 1,
  JUNIOR = 2,
  MID = 3,
  SENIOR = 4,
  MASTER = 5,
  EXPERT = 6,
}

export enum ESex {
  FEMALE = 0,
  MALE = 1,
  BISEXUAL = 2,
  UNKNOWN = 3,
}

export enum EComplexity {
  EASY = 0,
  MEDIUM = 1,
  HARD = 2,
  HELL = 3,
}

export enum EPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  GOAT = 3,
}

export enum EPaymenType {
  PERTASK = 'PerTask',
  PERHOURS = 'PerHour',
  PERWEEK = 'PerWeek',
  PERMONTH = 'PerMonth',
  WHENDONE = 'WhenDone',
}

export enum EError {
  authorization = 'Authorization is required!',
  userEmailNotFound = 'Invalid email!',
  invalidPassword = 'Invalid password!',
  invalidData = 'You have send invalid data!',
  unauthorized = 'Unauthorized',
  userAlreadyExists = 'User with this email address already exists!',
  incorrectRoom = 'Chat with this room does not exist',
  interlocutorNotFound = 'Chat with this interlocutor does not exist!',
  invalidRefreshToken = 'Invalid refreshToken!',
}

export enum EUserType {
  FREELANCER = 'Freelancer',
  CLIENT = 'Client',
  ADMIN = 'admin',
}

export enum EInvitationType {
  CONTRACT = 'Contract',
  WORK = 'Work',
  MESSAGE = 'Message',
}

export enum EPaymentMethod {
  VNPAY = 'VNPay',
  PAYPAL = 'Paypal',
  BALANCE = 'Balance',
}

export enum EMessagePurpose {
  Proposal = 'Proposal',
  Job = 'Job',
  None = 'Communication',
}

export enum ERoomType {
  Single = 'Single',
  Multi = 'Multi',
}

export enum EMessageType {
  Normal = 'Normal',
  HTML = 'HTML',
  Attachment = 'Attachment',
  Embed = 'Embed',
}

export enum EPaymentPurpose {
  BUYSICK = 'Buy_Sicks_Point',
  RECHARGE = 'Recharge',
  ESCROW = 'Escrow',
}

export enum ESocketEvent {
  USER_DISCONNECTED = 'User_DisConnected',
  SENDNOTIFY = 'Send_Notify',
  USER_CONNECTED = 'User_Connected',
  SENDMSG = 'Send_Msg',
  JOBCHANGE = 'Job_Change',
  PROPOSALCHANGE = 'Proposal_Change',
  CONTRACTCHANGE = 'Contract_Change',
  BACKUP_DATA = 'Backup_Data',
  SICKSETTING = 'Sick_Setting',
  DEACTIVE = 'Deactive',
}
