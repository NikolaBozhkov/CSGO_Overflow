"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var user_model_1 = require('../user/user.model');
var message_model_1 = require('./message.model');
var io_service_1 = require('../io/io.service');
var moment = require('moment');
var ChatComponent = (function () {
    function ChatComponent(ioService) {
        this.ioService = ioService;
        this.messages = [];
    }
    ChatComponent.prototype.ngOnInit = function () {
        this.ioService.socket.on('chatUpdate', this.handleChatUpdate.bind(this));
        this.ioService.socket.on('allMessages', this.handleAllMessages.bind(this));
    };
    ChatComponent.prototype.ngAfterViewChecked = function () {
        this.scrollToBottom();
    };
    ChatComponent.prototype.handleChatUpdate = function (data) {
        data.time = this.convertTimeLocal(data.time);
        if (data.source === 'bot') {
            data = this.createBotMessage(data.text);
        }
        this.messages.push(data);
        if (this.messages.length > ChatComponent.MaxMsgCount) {
            this.messages.shift();
        }
    };
    ChatComponent.prototype.handleAllMessages = function (data) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var msg = data_1[_i];
            msg.time = this.convertTimeLocal(msg.time);
        }
        this.messages = data;
        // Add bot messages
        this.messages.push(this.createBotMessage('Welcome to CSGO Overflow! If you have any questions, check out the FAQ or ask them here! Happy playing :-)'));
        this.messages.push(this.createBotMessage('Expect more items in the marketplace!'));
        if (!this.isUserLoggedIn) {
            this.messages.push(this.createBotMessage('If you want to send messages, you need to log in.'));
        }
    };
    ChatComponent.prototype.convertTimeLocal = function (time) {
        return moment(time).format('HH:mm');
    };
    ChatComponent.prototype.sendMessage = function (message) {
        // Do not allow empty messages
        if (!message.value.trim()) {
            return;
        }
        this.ioService.socket.emit('newMessage', {
            username: this.user.name,
            avatarUrl: this.user.avatarUrl,
            time: moment.utc().format(),
            text: message.value
        });
        message.value = null;
    };
    ChatComponent.prototype.scrollToBottom = function () {
        var container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    };
    ChatComponent.prototype.createBotMessage = function (text) {
        return new message_model_1.Message(ChatComponent.BotName, 'client/images/robot.png', moment().format('HH:mm'), text, 'bot');
    };
    ChatComponent.BotName = 'Overflow Bot';
    ChatComponent.MaxMsgCount = 75;
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ChatComponent.prototype, "isUserLoggedIn", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', user_model_1.User)
    ], ChatComponent.prototype, "user", void 0);
    ChatComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'chat-widget',
            templateUrl: 'chat.component.html'
        }), 
        __metadata('design:paramtypes', [io_service_1.IoService])
    ], ChatComponent);
    return ChatComponent;
}());
exports.ChatComponent = ChatComponent;
//# sourceMappingURL=chat.component.js.map