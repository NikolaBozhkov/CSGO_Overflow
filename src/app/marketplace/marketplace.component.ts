import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Item } from './item.model';
import { User } from '../user/user.model';

import { NotificationsService } from 'angular2-notifications';
import { ItemService } from './item.service';
import { UserService } from '../user/user.service';

import * as util from '../util/util';

@Component({
    selector: 'marketplace',
    templateUrl: './marketplace.component.html',
    providers: [ItemService]
})

export class MarketplaceComponent implements OnInit {
    @ViewChild('withdrawModal') withdrawModal: ModalComponent;
    user: User;
    items: Item[];
    selectedItems: Item[] = [];
    totalPrice = 0;
    checkoutDisabled = false;

    constructor(private itemService: ItemService, private userService: UserService, private notificationsService: NotificationsService) {}

    ngOnInit() {
        this.itemService.getItems()
            .then(items => this.items = items);

        if (this.userService.isUserLoggedIn()) {
            this.userService.getUser()
                .then(user => this.user = user);
        }
    }

    formatPrice(price: number) {
        return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    sortItemsByPrice(desc: boolean) {
        this.items.sort(util.dynamicSort('price', desc ? -1 : 1));
    }

    selectItem(item: Item) {
        if (item.selected) {
            item.selected = false;

            var index = this.selectedItems.indexOf(item);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
                this.totalPrice -= item.price;
            }
        } else {
            item.selected = true;
            this.selectedItems.push(item);
            this.totalPrice += item.price;
        }

        if ((this.user && this.user.staticCurrency >= this.totalPrice) || (!this.user && this.totalPrice == 0)) {
            this.checkoutDisabled = false;
        } else {
            this.checkoutDisabled = true;
        }
    }

    checkout() {
        // If user if logged in, check the trade url, then check if he has enough currency
        // If user has enough total, but not enough static, alert him
        if (this.user) {
            if (this.user.tradeUrl === '') {
                this.notificationsService.alert('Set Trade URL', 'Your steam trade URL is not set');
            } else if (this.user.staticCurrency >= this.totalPrice) {
                if (this.totalPrice > 0) {
                    this.withdrawModal.open();
                    // this.itemService.checkoutItems(this.selectedItems)
                    //     .then(this.handleCheckoutResponse.bind(this));
                }
            } else if (this.user.staticCurrency + this.user.activeCurrency >= this.totalPrice) {
                this.notificationsService.info('Not Enough Static', 'Move your active drops to static');
            } else {
                this.notificationsService.error('Not Enough Drops', 'Please select items of less value');
            }
        } else {
            this.notificationsService.alert('Log in', 'You must be logged in to purchase items');
        }
    }

    handleCheckoutResponse(res) {
        if (res.success == 1) {
            this.notificationsService.success('Success', 'Expect trade offer soon');
        } else {
            this.notificationsService.error('Error', res.message);
        }
    }
}
