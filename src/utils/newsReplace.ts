import { logger } from "../middleware/winston.middleware";

const replaceText: string[] = [
  "<!-- 본문 내용 -->",
  "<!-- TV플레이어 -->",
  "<!-- // TV플레이어 -->",
  `<script type="text/javascript">`,
  `// flash 오류를 우회하기 위한 함수 추가`,
  `function _flash_removeCallback() {}`,
  `</script>`,
  "<!-- // 본문 내용 -->",
];

export const replaceContent = (content: any): string | undefined => {
  try{
    replaceText.forEach((element: string) => {
      content = content.replace(element, "");
    });
    return content.trim();
  } catch(e) {
    logger.error(e);
  }
};
