import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import Talk from 'talkjs';

@Injectable({
  providedIn: 'root'
})
export class TalkService {
  private currentUser: Talk.User;

  async createUser(applicationUser: any) {
    await Talk.ready;
    return new Talk.User({
      id: applicationUser.id,
      name: applicationUser.username,
      photoUrl: applicationUser.photoUrl,
      role: applicationUser.role
    });
  }


  private async getOrCreateConversation(session: Talk.Session, otherApplicationUser: any) {
    const otherUser = await this.createUser(otherApplicationUser);
    const conversation = session.getOrCreateConversation(Talk.oneOnOneId(this.currentUser, otherUser));
    conversation.setParticipant(this.currentUser);
    conversation.setParticipant(otherUser);
    return conversation;
  }

  async getOrCreateConversationChat(idchat:string) {
    await Talk.ready;
    const me = new Talk.User({
        id: localStorage['uid'],
        name: localStorage['nombre'],
        email: localStorage['email'],
        //photoUrl: "localStorage['imagen']"

    });
    const session = new Talk.Session({
        appId: "tOfCBxbB",
        me: me
    });

    const conversation = session.getOrCreateConversation(idchat);
    conversation.setParticipant(me);
    conversation.setAttributes({
        photoUrl: "https://talkjs.com/images/avatar-5.jpg",
        subject: "Viaje 20 Diciembre"
    });

    const chatbox = session.createChatbox();
    chatbox.select(conversation);
    chatbox.mount(document.getElementById("talkjs-container"));
    return true;
  }


  async salirGrupo(idchat:string){
    await Talk.ready;
    const me = new Talk.User({
        id: localStorage['uid'],
        name: localStorage['nombre'],
        email: "sebastian@example.com",
        role: "admin"

    });
    const session = new Talk.Session({
        appId: "tOfCBxbB",
        me: me,
    });
    const leave =session.getOrCreateConversation(idchat).leave();
  }


}
