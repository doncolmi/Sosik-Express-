import userModel from "./user.model";
import saveModel from "../save/save.model";
import fakeNewsModel from "../news/fakeNewsLog.model";
import pressFollowModel from "../press/pressFollow.model";
import topicFollowModel from "../topic/topicFollow.model";

class UserService {
  private user = userModel;
  private save = saveModel;
  private fakeNews = fakeNewsModel;
  private pressFollow = pressFollowModel;
  private topicFollow = topicFollowModel;

  public deleteUser = async (userId: number) => {
    await this.save.deleteMany({ userId: userId });
    await this.fakeNews.deleteMany({ userId: userId });
    await this.pressFollow.deleteMany({ userId: userId });
    await this.topicFollow.deleteMany({ userId: userId });
    const userDelete = await this.user.deleteMany({ userId: userId });
    return userDelete.deletedCount! > 0;
  };
}

export default UserService;
