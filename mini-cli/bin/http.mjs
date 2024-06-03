// 引入axios
// const axios = require("axios");
import axios from "axios";

axios.interceptors.response.use((res) => {
  return res.data;
});

// 获取git上的项目列表
export async function getRepoList() {
  return axios.get("https://api.github.com/orgs/yuan-cli/repos");
}

// module.exports = {
//   getRepolist,
// };
