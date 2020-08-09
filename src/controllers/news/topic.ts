class Topic {
  private 100 = "정치";
  private 101 = "경제";
  private 102 = "사회";
  private 103 = "생활";
  private 105 = "IT";
  private 110 = "오피니언";

  public getTopicName = (topicId: string) => {
    if (topicId === "100") return this[100];
    if (topicId === "101") return this[101];
    if (topicId === "102") return this[102];
    if (topicId === "103") return this[103];
    if (topicId === "105") return this[105];
    return this[110];
  };

  public getTopicId = (): string[] => {
    return ["100", "101", "102", "103", "105", "100"];
  };
}

export default Topic;
