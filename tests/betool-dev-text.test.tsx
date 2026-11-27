import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DevTextTool } from "@/components/betool/devText/DevTextTool";
import { calculateHash } from "@/components/betool/devText/code-tools";
import { convertBase } from "@/components/betool/devText/transform";

function enter(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

describe("developer and text tools", () => {
  it("generates the requested number and length of passwords from the chosen characters", () => {
    render(<DevTextTool slug="randompassword" />);
    enter("包含字符", "甲乙");
    enter("生成长度", "5");
    enter("生成数量", "3");
    click("生成密码");
    const passwords = (screen.getByLabelText<HTMLTextAreaElement>("生成结果").value).split("\n");
    expect(passwords).toHaveLength(3);
    expect(passwords.every((password) => /^[甲乙]{5}$/.test(password))).toBe(true);
  });

  it("converts both second timestamps and Beijing time at the Unix epoch", () => {
    render(<DevTextTool slug="timetran" />);
    enter("时间戳", "0");
    click("转换为北京时间");
    expect(screen.getByLabelText("北京时间")).toHaveValue("1970-01-01 08:00:00");
    enter("时间", "1970-01-01 08:00:01");
    enter("输出单位", "s");
    click("转换为时间戳");
    expect(screen.getByLabelText("转换时间戳结果")).toHaveValue("1");
  });

  it("produces both standard MD5 lengths", async () => {
    render(<DevTextTool slug="MD5" />);
    enter("请输入要计算哈希的文本", "abc");
    click("MD5加密");
    await waitFor(() => expect(screen.getByLabelText("32位小写")).toHaveValue("900150983cd24fb0d6963f7d28e17f72"));
    expect(screen.getByLabelText("16位大写")).toHaveValue("3CD24FB0D6963F7D");
  });

  it("pretty prints, escapes, unescapes, and minifies JSON", async () => {
    render(<DevTextTool slug="json" />);
    enter("代码", '{"a":"中文","n":[1,2]}');
    click("校验/格式化");
    await waitFor(() => expect(screen.getByLabelText("代码")).toHaveValue(JSON.stringify({ a: "中文", n: [1, 2] }, null, 2)));
    click("压缩");
    await waitFor(() => expect(screen.getByLabelText("代码")).toHaveValue('{"a":"中文","n":[1,2]}'));
    click("转义");
    await waitFor(() => expect(screen.getByLabelText("代码")).toHaveValue('{\\"a\\":\\"中文\\",\\"n\\":[1,2]}'));
    click("去转义");
    await waitFor(() => expect(screen.getByLabelText("代码")).toHaveValue('{"a":"中文","n":[1,2]}'));
  });

  it("converts Chinese Unicode escapes without changing ordinary text or emoji", async () => {
    render(<DevTextTool slug="unicode" />);
    enter("待处理的文本", "中A🙂");
    click("中文转unicode");
    await waitFor(() => expect(screen.getByLabelText("处理结果")).toHaveValue("\\u4e2dA🙂"));
    enter("待处理的文本", "\\u4e2dA🙂");
    click("unicode转中文");
    await waitFor(() => expect(screen.getByLabelText("处理结果")).toHaveValue("中A🙂"));
  });

  it("filters the reference HTTP status table accurately", () => {
    render(<DevTextTool slug="HttpStatusCode" />);
    enter("搜索状态码或含义", "404");
    const table = screen.getByRole("table");
    expect(within(table).getByRole("rowheader", { name: /404 Not Found/i })).toBeInTheDocument();
    expect(within(table).queryByRole("rowheader", { name: /200 OK/i })).toBeNull();
  });

  it("decodes a JWT into separate JSON header and payload", () => {
    render(<DevTextTool slug="jwt" />);
    enter("JWT", "eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMifQ.");
    click("解析");
    expect(screen.getByLabelText("Header(头部)")).toHaveValue('{\n  "alg": "none"\n}');
    expect(screen.getByLabelText("Payload(载荷)")).toHaveValue('{\n  "sub": "123"\n}');
  });

  it("round trips named HTML character entities", async () => {
    render(<DevTextTool slug="HtmlEntity" />);
    enter("待处理的文本", "<你好 & hello>");
    click("HTML转实体");
    await waitFor(() => expect(screen.getByLabelText("处理结果")).toHaveValue("&lt;你好 &amp; hello&gt;"));
    enter("待处理的文本", "&lt;你好 &amp; hello&gt;");
    click("实体转HTML");
    await waitFor(() => expect(screen.getByLabelText("处理结果")).toHaveValue("<你好 & hello>"));
  });

  it.each([
    ["JSForamt", "const nums=[1,2,3]", "const nums = [1, 2, 3];\n"],
    ["HtmlFormat", '<div      id="x"><p>content</p></div>', '<div id="x"><p>content</p></div>\n'],
    ["CssFormat", ".section{color:red}", ".section {\n  color: red;\n}\n"],
  ])("formats %s with a parser", async (slug, input, expected) => {
    render(<DevTextTool slug={slug} />);
    enter("代码", input);
    click("格式化");
    await waitFor(() => expect(screen.getByLabelText("代码")).toHaveValue(expected));
  });

  it("converts whole numbers and fractions without losing large integers", () => {
    render(<DevTextTool slug="baseconverter" />);
    enter("请输入要转换的数值", "10.5");
    expect(screen.getByLabelText("转换结果")).toHaveValue("1010.1");
    expect(convertBase("9007199254740993", 10, 16)).toBe("20000000000001");
    expect(() => convertBase("12", 2, 10)).toThrow("不支持");
  });

  it("uses 1024-based storage units and supports conversion to bits", () => {
    render(<DevTextTool slug="storageconverter" />);
    enter("请输入数值", "1024");
    expect(screen.getByLabelText("转换结果")).toHaveValue("1.000000");
    enter("到单位", "bit");
    expect(screen.getByLabelText("转换结果")).toHaveValue("8192.000000");
  });

  it("calculates a standard HMAC-MD5 vector", async () => {
    expect(await calculateHash("The quick brown fox jumps over the lazy dog", "HMAC-MD5", "key"))
      .toBe("80070713463e7749b90c2dc24911e275");
    render(<DevTextTool slug="hashcalculator" />);
    enter("请输入要计算哈希的文本", "abc");
    click("计算哈希");
    await waitFor(() => expect(screen.getByLabelText("哈希结果")).toHaveValue("900150983cd24fb0d6963f7d28e17f72"));
  });

  it("formats XML and preserves its meaningful text on compression", async () => {
    render(<DevTextTool slug="xmlformat" />);
    enter("请输入要格式化的XML文本", "<a><b>Hello world</b></a>");
    click("格式化");
    await waitFor(() => expect(screen.getByLabelText("格式化结果")).toHaveValue("<a>\n  <b>Hello world</b>\n</a>"));
    click("压缩");
    await waitFor(() => expect(screen.getByLabelText("格式化结果")).toHaveValue("<a><b>Hello world</b></a>"));
  });

  it("compacts SQL without splitting its quoted values", async () => {
    render(<DevTextTool slug="sqlformat" />);
    enter("请输入要格式化的SQL", "SELECT name FROM items WHERE name = 'a   b';");
    click("压缩");
    await waitFor(() => expect(screen.getByLabelText("格式化结果")).toHaveValue("SELECT name FROM items WHERE name = 'a   b';"));
  });

  it("highlights replacements in the diff", async () => {
    render(<DevTextTool slug="diff" />);
    enter("请输入文本1", "旧内容\n");
    enter("请输入文本2", "新内容\n");
    click("对比文本");
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("+1 additions / -1 deletions"));
    expect(screen.getByRole("insertion")).toHaveTextContent("新内容");
    expect(screen.getByRole("deletion")).toHaveTextContent("旧内容");
  });

  it("renders Markdown and strips executable HTML", async () => {
    render(<DevTextTool slug="markdown" />);
    enter("Markdown", "# 标题\n\n**正文**\n\n<script>window.bad=42</script>");
    const preview = screen.getByRole("article", { name: "Markdown 预览" });
    await waitFor(() => expect(within(preview).getByRole("heading", { name: "标题" })).toBeInTheDocument());
    expect(preview.querySelector("strong")).toHaveTextContent("正文");
    expect(preview.querySelector("script")).toBeNull();
  });

  it("counts Chinese, ASCII letters, digits, punctuation and whitespace separately", () => {
    render(<DevTextTool slug="wordCount" />);
    enter("请输入或者粘贴需要统计的文本", " 中Aé９1㊗🙂，?!\n ");
    const counts = screen.getAllByRole("definition").map((item) => item.textContent);
    expect(counts).toEqual(["9", "1", "1", "1", "2", "1", "3"]);
  });

  it("deduplicates lines and preserves the first occurrence order", () => {
    render(<DevTextTool slug="textRemoveDuplicate" />);
    enter("待处理的文本", "甲\n乙\n甲\n丙\n乙");
    expect(screen.getByLabelText("处理结果")).toHaveValue("甲\n乙\n丙");
  });

  it("renders a Figlet banner using the selected font", async () => {
    render(<DevTextTool slug="asciiWordPic" />);
    enter("请输入内容", "A");
    click("生成");
    await waitFor(() => expect(screen.getByLabelText("ASCII 字形")).toHaveTextContent("/\\"));
  });

  it("exports editable rich text as HTML", () => {
    render(<DevTextTool slug="textEdit" />);
    const editor = screen.getByRole("textbox", { name: "富文本" });
    editor.innerHTML = "<p>示例</p>";
    fireEvent.input(editor);
    expect(screen.getByLabelText("HTML 预览")).toHaveValue("<p>示例</p>");
  });

  it("replaces literal punctuation and supports regular expression groups", () => {
    render(<DevTextTool slug="textreplace" />);
    enter("请输入要处理的文本", "a. A. x");
    enter("请输入要查找的文本", "a.");
    enter("请输入要替换的文本", "$&");
    expect(screen.getByLabelText("替换结果")).toHaveValue("$& $& x");
    enter("请输入要查找的文本", "([a-z])\\.");
    enter("请输入要替换的文本", "[$1]");
    fireEvent.click(screen.getByRole("checkbox", { name: "使用正则表达式" }));
    expect(screen.getByLabelText("替换结果")).toHaveValue("[a] [A] x");
  });

  it("runs workflow steps in the selected order", () => {
    render(<DevTextTool slug="textworkflow" />);
    enter("请输入要处理的文本", " B \n\n A ");
    click("添加步骤");
    click("去除每行首尾空格");
    click("添加步骤");
    click("按字母排序");
    click("执行工作流");
    expect(screen.getByLabelText("处理结果")).toHaveValue("a\nb");
  });

  it("counts words case-insensitively and excludes short terms", () => {
    render(<DevTextTool slug="wordfrequency" />);
    enter("请输入要统计词频的文本", "Hello hello I 你好 你好");
    click("统计词频");
    expect(screen.getByRole("row", { name: "hello 2" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: "你好 2" })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: "i 1" })).toBeNull();
  });
});
