const express = require("express");
const router = express.Router();
//file d'appoggio per collegare le API

//USERS API
router.use("/", require("./users/add_user"));
router.use("/", require("./users/remove_user"));
router.use("/", require("./users/update_user"));
router.use("/", require("./users/get_all_users"));
router.use("/", require("./users/user_login"));
router.use("/", require("./users/follow_project"));
router.use("/", require("./users/unfollow_project"));
router.use("/", require("./users/get_user_by_id"));
router.use("/", require("./users/add_support_proj"));
router.use("/", require("./users/get_user_role"));

//PROJECTS API
router.use("/", require("./projects/add_project"));
router.use("/", require("./projects/add_proj_to_manager"));
router.use("/", require("./projects/get_proj_list"));
router.use("/", require("./projects/get_proj_by_name"));
router.use("/", require("./projects/delete_project"));
router.use("/", require("./projects/upload_images"));
router.use("/", require("./projects/get_proj_by_id"));
router.use("/", require("./projects/explore_projects"));
router.use("/", require("./projects/get_followed_projects"));
router.use("/", require("./projects/get_proj_created"));
router.use("/", require("./projects/add_collaborator_to_proj"));
router.use("/", require("./projects/get_collabs_from_proj"));

//NEWS API
router.use("/", require("./news/add_news"));
router.use("/", require("./news/add_like"));
router.use("/", require("./news/add_comment"));
router.use("/", require("./news/add_file_news"));
router.use("/", require("./news/get_news_by_proj"));
router.use("/", require("./news/delete_news"));
router.use("/", require("./news/get_news_followed"));

module.exports = router;
