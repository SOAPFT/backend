import { HttpException } from '@nestjs/common';
import { ErrorCode, getErrorInfo } from '../types/error-code.enum';

export class CustomException extends HttpException {
  public readonly errorCode: string;
  public readonly timestamp: string;

  constructor(errorCode: ErrorCode, customMessage?: string, details?: any) {
    const errorInfo = getErrorInfo(errorCode);
    const message = customMessage || errorInfo.message;

    super(
      {
        errorCode: errorInfo.code,
        message,
        timestamp: new Date().toISOString(),
        details,
      },
      errorInfo.httpStatus,
    );

    this.errorCode = errorInfo.code;
    this.timestamp = new Date().toISOString();
  }

  static throw(
    errorCode: ErrorCode,
    customMessage?: string,
    details?: any,
  ): never {
    throw new CustomException(errorCode, customMessage, details);
  }
}

// 편의성을 위한 헬퍼 함수들
export class BusinessException {
  // === 사용자 관련 ===
  static userNotFound(userUuid?: string): never {
    CustomException.throw(ErrorCode.USER_NOT_FOUND, undefined, { userUuid });
  }

  static insufficientCoins(required: number, current: number): never {
    CustomException.throw(
      ErrorCode.INSUFFICIENT_COINS,
      `필요한 코인: ${required}, 보유 코인: ${current}`,
      { required, current },
    );
  }

  // === 챌린지 관련 ===
  static challengeNotFound(challengeUuid?: string): never {
    CustomException.throw(ErrorCode.CHALLENGE_NOT_FOUND, undefined, {
      challengeUuid,
    });
  }

  static challengeAlreadyStarted(): never {
    CustomException.throw(ErrorCode.CHALLENGE_ALREADY_STARTED);
  }

  static challengeFull(maxMember: number): never {
    CustomException.throw(
      ErrorCode.CHALLENGE_FULL,
      `최대 참여 인원(${maxMember}명)을 초과했습니다.`,
      { maxMember },
    );
  }

  static ageRestrictionNotMet(
    userAge: number,
    minAge: number,
    maxAge: number,
  ): never {
    CustomException.throw(
      ErrorCode.AGE_RESTRICTION_NOT_MET,
      `참여 가능 연령: ${minAge}세 ~ ${maxAge}세 (현재: ${userAge}세)`,
      { userAge, minAge, maxAge },
    );
  }

  static genderRestrictionNotMet(
    requiredGender: string,
    userGender: string,
  ): never {
    CustomException.throw(
      ErrorCode.GENDER_RESTRICTION_NOT_MET,
      `${requiredGender} 전용 챌린지입니다.`,
      { requiredGender, userGender },
    );
  }

  // === 인증글 관련 ===
  static postNotFound(postUuid?: string): never {
    CustomException.throw(ErrorCode.POST_NOT_FOUND, undefined, { postUuid });
  }

  static postImageLimitExceeded(limit: number, provided: number): never {
    CustomException.throw(
      ErrorCode.POST_IMAGE_LIMIT_EXCEEDED,
      `이미지는 최대 ${limit}개까지 업로드 가능합니다. (현재: ${provided}개)`,
      { limit, provided },
    );
  }

  // === 댓글 관련 ===
  static commentNotFound(commentId?: number): never {
    CustomException.throw(ErrorCode.COMMENT_NOT_FOUND, undefined, {
      commentId,
    });
  }

  static commentTooLong(maxLength: number, currentLength: number): never {
    CustomException.throw(
      ErrorCode.COMMENT_TOO_LONG,
      `댓글은 최대 ${maxLength}자까지 작성 가능합니다. (현재: ${currentLength}자)`,
      { maxLength, currentLength },
    );
  }

  static mentionedUserNotFound(userUuids: string[]): never {
    CustomException.throw(
      ErrorCode.MENTIONED_USER_NOT_FOUND,
      `멘션된 사용자를 찾을 수 없습니다: ${userUuids.join(', ')}`,
      { userUuids },
    );
  }

  // === 친구 관계 관련 ===
  static friendshipNotFound(friendshipId?: number): never {
    CustomException.throw(ErrorCode.FRIENDSHIP_NOT_FOUND, undefined, {
      friendshipId,
    });
  }

  static alreadyFriends(userUuid: string): never {
    CustomException.throw(ErrorCode.ALREADY_FRIENDS, undefined, { userUuid });
  }

  static cannotFriendSelf(): never {
    CustomException.throw(ErrorCode.CANNOT_FRIEND_SELF);
  }

  static notFriendsCannotChat(): never {
    CustomException.throw(ErrorCode.NOT_FRIENDS_CANNOT_CHAT);
  }

  // === 채팅 관련 ===
  static chatRoomNotFound(roomUuid?: string): never {
    CustomException.throw(ErrorCode.CHAT_ROOM_NOT_FOUND, undefined, {
      roomUuid,
    });
  }

  static messageNotFound(messageId?: number): never {
    CustomException.throw(ErrorCode.MESSAGE_NOT_FOUND, undefined, {
      messageId,
    });
  }

  static cannotLeaveDirectChat(): never {
    CustomException.throw(ErrorCode.CANNOT_LEAVE_DIRECT_CHAT);
  }

  static messageTooLong(maxLength: number, currentLength: number): never {
    CustomException.throw(
      ErrorCode.MESSAGE_TOO_LONG,
      `메시지는 최대 ${maxLength}자까지 작성 가능합니다. (현재: ${currentLength}자)`,
      { maxLength, currentLength },
    );
  }

  // === 좋아요 관련 ===
  static alreadyLiked(): never {
    CustomException.throw(ErrorCode.ALREADY_LIKED);
  }

  static cannotLikeOwnPost(): never {
    CustomException.throw(ErrorCode.CANNOT_LIKE_OWN_POST);
  }

  static notLikedPost(): never {
    CustomException.throw(ErrorCode.NOT_LIKED_POST);
  }

  // === 차단 관련 ===
  static alreadyBlocked(userUuid: string): never {
    CustomException.throw(ErrorCode.ALREADY_BLOCKED, undefined, { userUuid });
  }

  static cannotBlockSelf(): never {
    CustomException.throw(ErrorCode.CANNOT_BLOCK_SELF);
  }

  static blockedByUser(userUuid: string): never {
    CustomException.throw(ErrorCode.BLOCKED_BY_USER, undefined, { userUuid });
  }

  // === 파일 관련 ===
  static fileUploadFailed(fileName?: string, reason?: string): never {
    CustomException.throw(
      ErrorCode.FILE_UPLOAD_FAILED,
      reason ? `파일 업로드 실패: ${reason}` : undefined,
      { fileName, reason },
    );
  }

  static invalidFileType(allowedTypes: string[], providedType: string): never {
    CustomException.throw(
      ErrorCode.INVALID_FILE_TYPE,
      `허용된 파일 형식: ${allowedTypes.join(', ')} (제공된 형식: ${providedType})`,
      { allowedTypes, providedType },
    );
  }

  static fileSizeExceeded(maxSize: number, currentSize: number): never {
    CustomException.throw(
      ErrorCode.FILE_SIZE_EXCEEDED,
      `파일 크기 제한: ${maxSize}MB (현재: ${Math.round(currentSize / 1024 / 1024)}MB)`,
      { maxSize, currentSize },
    );
  }

  // === 인증 관련 ===
  static unauthorized(): never {
    CustomException.throw(ErrorCode.UNAUTHORIZED);
  }

  static forbidden(): never {
    CustomException.throw(ErrorCode.FORBIDDEN);
  }

  static invalidToken(): never {
    CustomException.throw(ErrorCode.INVALID_TOKEN);
  }

  static expiredToken(): never {
    CustomException.throw(ErrorCode.EXPIRED_TOKEN);
  }

  // === 알림 관련 ===
  static notificationNotFound(notificationId?: number): never {
    CustomException.throw(ErrorCode.NOTIFICATION_NOT_FOUND, undefined, {
      notificationId,
    });
  }
}
