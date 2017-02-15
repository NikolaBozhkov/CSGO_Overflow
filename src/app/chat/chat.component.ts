import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';

import { User } from '../user/user.model';
import { Message } from './message.model';

import { IoService } from '../io/io.service';

import * as moment from 'moment';

@Component({
    selector: 'chat-widget',
    templateUrl: './chat.component.html'
})

export class ChatComponent implements OnInit, AfterViewChecked {
    static BotName = 'Overflow Bot';
    static BotAvatar = 'assets/robot.png';
    static MaxMsgCount = 75;
    @Input() isUserLoggedIn: boolean;
    @Input() user: User;
    messages: Message[] = [];
    alreadyScrolled = false;

    constructor(private ioService: IoService) { }

    ngAfterViewChecked() {
        if (!this.alreadyScrolled) {
            this.scrollToBottom();
            this.alreadyScrolled = true;
        }
    }

    ngOnInit() {
        this.ioService.socket.on('chatUpdate', this.handleChatUpdate.bind(this));
        this.ioService.socket.on('allMessages', this.handleAllMessages.bind(this));
    }

    handleChatUpdate(data) {
        data.time = this.convertTimeLocal(data.time);

        if (data.source === 'bot') {
            data = this.createBotMessage(data.text);
        }

        this.messages.push(data);
        this.alreadyScrolled = false;

        if (this.messages.length > ChatComponent.MaxMsgCount) {
            this.messages.shift();
        }
    }

    handleAllMessages(data) {
        for (let msg of data) {
            msg.time = this.convertTimeLocal(msg.time);

            if (msg.source === 'bot') {
                msg.username = ChatComponent.BotName;
                msg.avatarUrl = ChatComponent.BotAvatar;
            }
        }

        this.messages = data;

        // Add bot messages
        //this.messages.push(this.createBotMessage('Welcome to CSGO Overflow! If you have any questions, check out the FAQ or ask them here! Happy playing :-)'));
        //this.messages.push(this.createBotMessage('Expect more items in the marketplace!'));

        if (!this.isUserLoggedIn) {
            //this.messages.push(this.createBotMessage('If you want to send messages, you need to log in.'))
        }

        this.messages.push(this.createBotMessage('NOTICE! Website is under rework, no items will be added to the shop.'));

        this.alreadyScrolled = false;
    }

    convertTimeLocal(time: string): string {
        return moment(time).format('HH:mm');
    }

    sendMessage(message: HTMLInputElement) {
        // Do not allow empty messages
        if (!message.value.trim()) {
            return;
        }

        this.ioService.socket.emit('newMessage', {
            username: this.user.name,
            avatarUrl: this.user.avatarUrl,
            time: moment.utc().format(),
            text: message.value,
        });

        message.value = null;
    }

    scrollToBottom() {
        let container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }

    createBotMessage(text: string) {
        return new Message(ChatComponent.BotName, ChatComponent.BotAvatar, moment().format('HH:mm'), text, 'bot', '');
    }
}
