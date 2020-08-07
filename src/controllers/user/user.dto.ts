import { IsString, IsNumber } from "class-validator";

class CreateUserDto {
  constructor(
    userId: number,
    name: string,
    profileImage: string,
    thumbnailImage: string,
    refreshToken?: string,
    tokenExp?: number
  ) {
    this.userId = userId;
    this.name = name;
    this.profileImage = profileImage;
    this.thumbnailImage = thumbnailImage;
    if (refreshToken && tokenExp) {
      this.refreshToken = refreshToken;
      this.tokenExp = tokenExp;
    }
  }

  @IsNumber()
  public userId: number;

  @IsString()
  public name: string;

  @IsString()
  public profileImage: string;

  @IsString()
  public thumbnailImage: string;

  @IsString()
  public refreshToken?: string;

  @IsNumber()
  public tokenExp?: number;
}

export default CreateUserDto;
