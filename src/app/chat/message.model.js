"use strict";
var Message = (function () {
    function Message(username, avatarUrl, time, text, source) {
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.time = time;
        this.text = text;
        this.source = source;
    }
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=message.model.js.map