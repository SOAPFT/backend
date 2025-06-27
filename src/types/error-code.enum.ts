import { HttpStatus } from '@nestjs/common';

export interface ErrorCodeInfo {
  code: string;
  message: string;
  httpStatus: HttpStatus;
}

export enum ErrorCode {
  // === 공통 오류 ===
  INTERNAL_SERVER_ERROR = 'SYS_001',
  DATABASE_ERROR = 'SYS_002',
  EXTERNAL_API_ERROR = 'SYS_003',
  INVALID_INPUT_VALUE = 'SYS_004',
  METHOD_NOT_ALLOWED = 'SYS_005',
  RESOURCE_NOT_FOUND = 'SYS_006',
  TOO_MANY_REQUESTS = 'SYS_007',

  // === 인증/인가 ===
  UNAUTHORIZED = 'AUTH_001',
  FORBIDDEN = 'AUTH_002',
  INVALID_TOKEN = 'AUTH_003',
  EXPIRED_TOKEN = 'AUTH_004',
  REFRESH_TOKEN_NOT_FOUND = 'AUTH_005',
  INVALID_REFRESH_TOKEN = 'AUTH_006',
  SOCIAL_LOGIN_FAILED = 'AUTH_007',

  // === 사용자 도메인 ===
  USER_NOT_FOUND = 'USER_001',
  DUPLICATE_USER = 'USER_002',
  INVALID_USER_STATUS = 'USER_003',
  USER_ALREADY_DELETED = 'USER_004',
  INVALID_AGE_RANGE = 'USER_005',
  INVALID_GENDER = 'USER_006',

  // === 계정/회원가입 ===
  EMAIL_ALREADY_EXISTS = 'ACCOUNT_001',
  PHONE_ALREADY_EXISTS = 'ACCOUNT_002',
  INVALID_PASSWORD = 'ACCOUNT_003',
  NICKNAME_ALREADY_EXISTS = 'ACCOUNT_004',
  INVALID_NICKNAME = 'ACCOUNT_005',
  SOCIAL_ID_ALREADY_EXISTS = 'ACCOUNT_006',

  // === 챌린지 ===
  CHALLENGE_NOT_FOUND = 'CHALLENGE_001',
  CHALLENGE_ALREADY_STARTED = 'CHALLENGE_002',
  CHALLENGE_ALREADY_FINISHED = 'CHALLENGE_003',
  CHALLENGE_FULL = 'CHALLENGE_004',
  CHALLENGE_ACCESS_DENIED = 'CHALLENGE_005',
  ALREADY_JOINED_CHALLENGE = 'CHALLENGE_006',
  NOT_JOINED_CHALLENGE = 'CHALLENGE_007',
  CHALLENGE_NOT_STARTED = 'CHALLENGE_008',
  INVALID_CHALLENGE_DATES = 'CHALLENGE_009',
  CHALLENGE_CREATOR_CANNOT_LEAVE = 'CHALLENGE_010',
  AGE_RESTRICTION_NOT_MET = 'CHALLENGE_011',
  GENDER_RESTRICTION_NOT_MET = 'CHALLENGE_012',
  CHALLENGE_CANNOT_EDIT = 'CHALLENGE_013',

  // === 인증글 (Posts) ===
  POST_NOT_FOUND = 'POST_001',
  POST_ACCESS_DENIED = 'POST_002',
  POST_ALREADY_DELETED = 'POST_003',
  INVALID_POST_CONTENT = 'POST_004',
  POST_IMAGE_LIMIT_EXCEEDED = 'POST_005',
  CHALLENGE_POST_REQUIRED = 'POST_006',
  POST_EDIT_TIME_EXPIRED = 'POST_007',

  // === 댓글 ===
  COMMENT_NOT_FOUND = 'COMMENT_001',
  COMMENT_ALREADY_DELETED = 'COMMENT_002',
  COMMENT_ACCESS_DENIED = 'COMMENT_003',
  COMMENT_TOO_LONG = 'COMMENT_004',
  COMMENT_EMPTY = 'COMMENT_005',
  PARENT_COMMENT_NOT_FOUND = 'COMMENT_006',
  INVALID_COMMENT_DEPTH = 'COMMENT_007',
  POST_NOT_FOUND_FOR_COMMENT = 'COMMENT_008',
  MENTIONED_USER_NOT_FOUND = 'COMMENT_009',
  COMMENT_EDIT_TIME_EXPIRED = 'COMMENT_010',

  // === 좋아요 ===
  LIKE_NOT_FOUND = 'LIKE_001',
  ALREADY_LIKED = 'LIKE_002',
  CANNOT_LIKE_OWN_POST = 'LIKE_003',
  NOT_LIKED_POST = 'LIKE_004',

  // === 친구 관계 ===
  FRIENDSHIP_NOT_FOUND = 'FRIENDSHIP_001',
  ALREADY_FRIENDS = 'FRIENDSHIP_002',
  FRIEND_REQUEST_ALREADY_SENT = 'FRIENDSHIP_003',
  FRIEND_REQUEST_NOT_FOUND = 'FRIENDSHIP_004',
  CANNOT_FRIEND_SELF = 'FRIENDSHIP_005',
  FRIEND_REQUEST_ALREADY_PROCESSED = 'FRIENDSHIP_006',
  NOT_FRIEND_REQUEST_RECIPIENT = 'FRIENDSHIP_007',
  NOT_FRIEND_REQUEST_SENDER = 'FRIENDSHIP_008',
  USERS_NOT_FRIENDS = 'FRIENDSHIP_009',

  // === 차단 ===
  BLOCK_NOT_FOUND = 'BLOCK_001',
  ALREADY_BLOCKED = 'BLOCK_002',
  CANNOT_BLOCK_SELF = 'BLOCK_003',
  NOT_BLOCKED_USER = 'BLOCK_004',
  BLOCKED_BY_USER = 'BLOCK_005',
  CANNOT_INTERACT_WITH_BLOCKED_USER = 'BLOCK_006',

  // === 채팅 ===
  CHAT_ROOM_NOT_FOUND = 'CHAT_001',
  CHAT_ROOM_ACCESS_DENIED = 'CHAT_002',
  MESSAGE_NOT_FOUND = 'CHAT_003',
  MESSAGE_ACCESS_DENIED = 'CHAT_004',
  CANNOT_LEAVE_DIRECT_CHAT = 'CHAT_005',
  CHAT_ROOM_FULL = 'CHAT_006',
  NOT_FRIENDS_CANNOT_CHAT = 'CHAT_007',
  MESSAGE_TOO_LONG = 'CHAT_008',
  INVALID_MESSAGE_TYPE = 'CHAT_009',
  MESSAGE_EDIT_TIME_EXPIRED = 'CHAT_010',

  // === 파일/업로드 ===
  FILE_UPLOAD_FAILED = 'FILE_001',
  FILE_NOT_FOUND = 'FILE_002',
  INVALID_FILE_TYPE = 'FILE_003',
  FILE_SIZE_EXCEEDED = 'FILE_004',
  INVALID_FILE_FORMAT = 'FILE_005',
  S3_UPLOAD_FAILED = 'FILE_006',
  IMAGE_PROCESSING_FAILED = 'FILE_007',

  // === 알림 ===
  NOTIFICATION_NOT_FOUND = 'NOTIFICATION_001',
  NOTIFICATION_ALREADY_READ = 'NOTIFICATION_002',
  PUSH_TOKEN_INVALID = 'NOTIFICATION_003',
  PUSH_SEND_FAILED = 'NOTIFICATION_004',

  // === 신고 ===
  REPORT_NOT_FOUND = 'REPORT_001',
  ALREADY_REPORTED = 'REPORT_002',
  CANNOT_REPORT_SELF = 'REPORT_003',
  INVALID_REPORT_TYPE = 'REPORT_004',
  INVALID_REPORT_REASON = 'REPORT_005',
  REPORT_TARGET_NOT_FOUND = 'REPORT_006',

  // === 코인/결제 ===
  INSUFFICIENT_COINS = 'COIN_001',
  INVALID_COIN_AMOUNT = 'COIN_002',
  COIN_TRANSACTION_FAILED = 'COIN_003',
}

export const ERROR_CODE_INFO: Record<ErrorCode, ErrorCodeInfo> = {
  // === 공통 오류 ===
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    code: 'SYS_001',
    message: '서버 오류가 발생했습니다.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorCode.DATABASE_ERROR]: {
    code: 'SYS_002',
    message: '데이터베이스 오류가 발생했습니다.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorCode.EXTERNAL_API_ERROR]: {
    code: 'SYS_003',
    message: '외부 API 호출 중 오류가 발생했습니다.',
    httpStatus: HttpStatus.BAD_GATEWAY,
  },
  [ErrorCode.INVALID_INPUT_VALUE]: {
    code: 'SYS_004',
    message: '입력값이 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.METHOD_NOT_ALLOWED]: {
    code: 'SYS_005',
    message: '허용되지 않은 메서드입니다.',
    httpStatus: HttpStatus.METHOD_NOT_ALLOWED,
  },
  [ErrorCode.RESOURCE_NOT_FOUND]: {
    code: 'SYS_006',
    message: '요청한 리소스를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.TOO_MANY_REQUESTS]: {
    code: 'SYS_007',
    message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    httpStatus: HttpStatus.TOO_MANY_REQUESTS,
  },

  // === 인증/인가 ===
  [ErrorCode.UNAUTHORIZED]: {
    code: 'AUTH_001',
    message: '로그인이 필요합니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.FORBIDDEN]: {
    code: 'AUTH_002',
    message: '접근 권한이 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.INVALID_TOKEN]: {
    code: 'AUTH_003',
    message: '유효하지 않은 토큰입니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.EXPIRED_TOKEN]: {
    code: 'AUTH_004',
    message: '토큰이 만료되었습니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.REFRESH_TOKEN_NOT_FOUND]: {
    code: 'AUTH_005',
    message: '리프레시 토큰을 찾을 수 없습니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.INVALID_REFRESH_TOKEN]: {
    code: 'AUTH_006',
    message: '유효하지 않은 리프레시 토큰입니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.SOCIAL_LOGIN_FAILED]: {
    code: 'AUTH_007',
    message: '소셜 로그인에 실패했습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // === 사용자 도메인 ===
  [ErrorCode.USER_NOT_FOUND]: {
    code: 'USER_001',
    message: '존재하지 않는 사용자입니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.DUPLICATE_USER]: {
    code: 'USER_002',
    message: '이미 존재하는 사용자입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.INVALID_USER_STATUS]: {
    code: 'USER_003',
    message: '사용자 상태가 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.USER_ALREADY_DELETED]: {
    code: 'USER_004',
    message: '이미 탈퇴한 사용자입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_AGE_RANGE]: {
    code: 'USER_005',
    message: '연령 범위가 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_GENDER]: {
    code: 'USER_006',
    message: '성별 정보가 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // === 계정/회원가입 ===
  [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    code: 'ACCOUNT_001',
    message: '이미 등록된 이메일입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.PHONE_ALREADY_EXISTS]: {
    code: 'ACCOUNT_002',
    message: '이미 등록된 휴대폰 번호입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.INVALID_PASSWORD]: {
    code: 'ACCOUNT_003',
    message: '비밀번호가 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.NICKNAME_ALREADY_EXISTS]: {
    code: 'ACCOUNT_004',
    message: '이미 사용 중인 닉네임입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.INVALID_NICKNAME]: {
    code: 'ACCOUNT_005',
    message: '닉네임 형식이 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.SOCIAL_ID_ALREADY_EXISTS]: {
    code: 'ACCOUNT_006',
    message: '이미 등록된 소셜 계정입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },

  // === 챌린지 ===
  [ErrorCode.CHALLENGE_NOT_FOUND]: {
    code: 'CHALLENGE_001',
    message: '존재하지 않는 챌린지입니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.CHALLENGE_ALREADY_STARTED]: {
    code: 'CHALLENGE_002',
    message: '이미 시작된 챌린지입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CHALLENGE_ALREADY_FINISHED]: {
    code: 'CHALLENGE_003',
    message: '이미 종료된 챌린지입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CHALLENGE_FULL]: {
    code: 'CHALLENGE_004',
    message: '챌린지 정원이 가득 찼습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CHALLENGE_ACCESS_DENIED]: {
    code: 'CHALLENGE_005',
    message: '챌린지에 접근할 권한이 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.ALREADY_JOINED_CHALLENGE]: {
    code: 'CHALLENGE_006',
    message: '이미 참여한 챌린지입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.NOT_JOINED_CHALLENGE]: {
    code: 'CHALLENGE_007',
    message: '참여하지 않은 챌린지입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CHALLENGE_NOT_STARTED]: {
    code: 'CHALLENGE_008',
    message: '아직 시작되지 않은 챌린지입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_CHALLENGE_DATES]: {
    code: 'CHALLENGE_009',
    message: '챌린지 날짜가 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CHALLENGE_CREATOR_CANNOT_LEAVE]: {
    code: 'CHALLENGE_010',
    message: '챌린지 생성자는 나갈 수 없습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.AGE_RESTRICTION_NOT_MET]: {
    code: 'CHALLENGE_011',
    message: '연령 제한에 맞지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.GENDER_RESTRICTION_NOT_MET]: {
    code: 'CHALLENGE_012',
    message: '성별 제한에 맞지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // === 인증글 (Posts) ===
  [ErrorCode.POST_NOT_FOUND]: {
    code: 'POST_001',
    message: '존재하지 않는 인증글입니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.POST_ACCESS_DENIED]: {
    code: 'POST_002',
    message: '인증글에 접근할 권한이 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.POST_ALREADY_DELETED]: {
    code: 'POST_003',
    message: '이미 삭제된 인증글입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_POST_CONTENT]: {
    code: 'POST_004',
    message: '인증글 내용이 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.POST_IMAGE_LIMIT_EXCEEDED]: {
    code: 'POST_005',
    message: '인증글 이미지 개수를 초과했습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CHALLENGE_POST_REQUIRED]: {
    code: 'POST_006',
    message: '챌린지 인증글이 필요합니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.POST_EDIT_TIME_EXPIRED]: {
    code: 'POST_007',
    message: '인증글 수정 시간이 만료되었습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CHALLENGE_CANNOT_EDIT]: {
    code: 'CHALLENGE_013',
    message: '챌린지 생성자는 수정할 수 없습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // === 댓글 ===
  [ErrorCode.COMMENT_NOT_FOUND]: {
    code: 'COMMENT_001',
    message: '존재하지 않는 댓글입니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.COMMENT_ALREADY_DELETED]: {
    code: 'COMMENT_002',
    message: '이미 삭제된 댓글입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.COMMENT_ACCESS_DENIED]: {
    code: 'COMMENT_003',
    message: '댓글에 접근할 권한이 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.COMMENT_TOO_LONG]: {
    code: 'COMMENT_004',
    message: '댓글이 너무 깁니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.COMMENT_EMPTY]: {
    code: 'COMMENT_005',
    message: '댓글 내용이 비어있습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.PARENT_COMMENT_NOT_FOUND]: {
    code: 'COMMENT_006',
    message: '부모 댓글을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.INVALID_COMMENT_DEPTH]: {
    code: 'COMMENT_007',
    message: '댓글 깊이가 유효하지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.POST_NOT_FOUND_FOR_COMMENT]: {
    code: 'COMMENT_008',
    message: '댓글을 작성할 인증글을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.MENTIONED_USER_NOT_FOUND]: {
    code: 'COMMENT_009',
    message: '멘션된 사용자를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.COMMENT_EDIT_TIME_EXPIRED]: {
    code: 'COMMENT_010',
    message: '댓글 수정 시간이 만료되었습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // === 좋아요 ===
  [ErrorCode.LIKE_NOT_FOUND]: {
    code: 'LIKE_001',
    message: '좋아요 정보를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.ALREADY_LIKED]: {
    code: 'LIKE_002',
    message: '이미 좋아요를 누른 인증글입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.CANNOT_LIKE_OWN_POST]: {
    code: 'LIKE_003',
    message: '자신의 인증글에는 좋아요를 누를 수 없습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.NOT_LIKED_POST]: {
    code: 'LIKE_004',
    message: '좋아요를 누르지 않은 인증글입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // === 친구 관계 ===
  [ErrorCode.FRIENDSHIP_NOT_FOUND]: {
    code: 'FRIENDSHIP_001',
    message: '친구 관계를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.ALREADY_FRIENDS]: {
    code: 'FRIENDSHIP_002',
    message: '이미 친구인 사용자입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.FRIEND_REQUEST_ALREADY_SENT]: {
    code: 'FRIENDSHIP_003',
    message: '이미 친구 요청을 보낸 사용자입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.FRIEND_REQUEST_NOT_FOUND]: {
    code: 'FRIENDSHIP_004',
    message: '친구 요청을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.CANNOT_FRIEND_SELF]: {
    code: 'FRIENDSHIP_005',
    message: '자기 자신에게 친구 요청을 보낼 수 없습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.FRIEND_REQUEST_ALREADY_PROCESSED]: {
    code: 'FRIENDSHIP_006',
    message: '이미 처리된 친구 요청입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.NOT_FRIEND_REQUEST_RECIPIENT]: {
    code: 'FRIENDSHIP_007',
    message: '친구 요청을 받은 사람이 아닙니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.NOT_FRIEND_REQUEST_SENDER]: {
    code: 'FRIENDSHIP_008',
    message: '친구 요청을 보낸 사람이 아닙니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.USERS_NOT_FRIENDS]: {
    code: 'FRIENDSHIP_009',
    message: '친구 관계가 아닌 사용자입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // === 차단 ===
  [ErrorCode.BLOCK_NOT_FOUND]: {
    code: 'BLOCK_001',
    message: '차단 정보를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.ALREADY_BLOCKED]: {
    code: 'BLOCK_002',
    message: '이미 차단된 사용자입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.CANNOT_BLOCK_SELF]: {
    code: 'BLOCK_003',
    message: '자기 자신을 차단할 수 없습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.NOT_BLOCKED_USER]: {
    code: 'BLOCK_004',
    message: '차단되지 않은 사용자입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.BLOCKED_BY_USER]: {
    code: 'BLOCK_005',
    message: '해당 사용자에게 차단되었습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.CANNOT_INTERACT_WITH_BLOCKED_USER]: {
    code: 'BLOCK_006',
    message: '차단된 사용자와는 상호작용할 수 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },

  // === 채팅 ===
  [ErrorCode.CHAT_ROOM_NOT_FOUND]: {
    code: 'CHAT_001',
    message: '채팅방을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.CHAT_ROOM_ACCESS_DENIED]: {
    code: 'CHAT_002',
    message: '채팅방에 접근할 권한이 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.MESSAGE_NOT_FOUND]: {
    code: 'CHAT_003',
    message: '메시지를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.MESSAGE_ACCESS_DENIED]: {
    code: 'CHAT_004',
    message: '메시지에 접근할 권한이 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.CANNOT_LEAVE_DIRECT_CHAT]: {
    code: 'CHAT_005',
    message: '1대1 채팅방은 나갈 수 없습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CHAT_ROOM_FULL]: {
    code: 'CHAT_006',
    message: '채팅방 정원이 가득 찼습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.NOT_FRIENDS_CANNOT_CHAT]: {
    code: 'CHAT_007',
    message: '친구가 아닌 사용자와는 채팅할 수 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.MESSAGE_TOO_LONG]: {
    code: 'CHAT_008',
    message: '메시지가 너무 깁니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_MESSAGE_TYPE]: {
    code: 'CHAT_009',
    message: '유효하지 않은 메시지 타입입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.MESSAGE_EDIT_TIME_EXPIRED]: {
    code: 'CHAT_010',
    message: '메시지 수정 시간이 만료되었습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // === 파일/업로드 ===
  [ErrorCode.FILE_UPLOAD_FAILED]: {
    code: 'FILE_001',
    message: '파일 업로드에 실패했습니다.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorCode.FILE_NOT_FOUND]: {
    code: 'FILE_002',
    message: '파일을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.INVALID_FILE_TYPE]: {
    code: 'FILE_003',
    message: '지원하지 않는 파일 형식입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.FILE_SIZE_EXCEEDED]: {
    code: 'FILE_004',
    message: '파일 크기가 제한을 초과했습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_FILE_FORMAT]: {
    code: 'FILE_005',
    message: '파일 형식이 올바르지 않습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.S3_UPLOAD_FAILED]: {
    code: 'FILE_006',
    message: 'S3 업로드에 실패했습니다.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorCode.IMAGE_PROCESSING_FAILED]: {
    code: 'FILE_007',
    message: '이미지 처리에 실패했습니다.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  // === 알림 ===
  [ErrorCode.NOTIFICATION_NOT_FOUND]: {
    code: 'NOTIFICATION_001',
    message: '알림을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.NOTIFICATION_ALREADY_READ]: {
    code: 'NOTIFICATION_002',
    message: '이미 읽은 알림입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.PUSH_TOKEN_INVALID]: {
    code: 'NOTIFICATION_003',
    message: '유효하지 않은 푸시 토큰입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.PUSH_SEND_FAILED]: {
    code: 'NOTIFICATION_004',
    message: '푸시 알림 전송에 실패했습니다.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  // === 신고 ===
  [ErrorCode.REPORT_NOT_FOUND]: {
    code: 'REPORT_001',
    message: '신고 정보를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.ALREADY_REPORTED]: {
    code: 'REPORT_002',
    message: '이미 신고된 콘텐츠입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.CANNOT_REPORT_SELF]: {
    code: 'REPORT_003',
    message: '자신의 콘텐츠는 신고할 수 없습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_REPORT_TYPE]: {
    code: 'REPORT_004',
    message: '유효하지 않은 신고 타입입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_REPORT_REASON]: {
    code: 'REPORT_005',
    message: '유효하지 않은 신고 사유입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.REPORT_TARGET_NOT_FOUND]: {
    code: 'REPORT_006',
    message: '신고 대상을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },

  // === 코인/결제 ===
  [ErrorCode.INSUFFICIENT_COINS]: {
    code: 'COIN_001',
    message: '코인이 부족합니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_COIN_AMOUNT]: {
    code: 'COIN_002',
    message: '유효하지 않은 코인 금액입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.COIN_TRANSACTION_FAILED]: {
    code: 'COIN_003',
    message: '코인 지불에 실패했습니다.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};

export function getErrorInfo(errorCode: ErrorCode): ErrorCodeInfo {
  return ERROR_CODE_INFO[errorCode];
}
