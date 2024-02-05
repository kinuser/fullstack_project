import internal from "stream"
import { StringLiteral } from "typescript"

export interface ThreadType {
    id: number
    name: string
    counter: number
    created_time: string
    original_poster: User
    last_message: Message
    last_time: string
    listened: boolean
}

export interface Message {
    id: number
    owner: User 
    created_time: string
    thread: ThreadInMessage
    text: string
    file: File[]
}

export interface ThreadInMessage {
    id: number
    name: string
}

export interface MessagesPacket {
    count: number
    next: string | null
    previous: string | null
    results: MessageResults

}

export interface MessageResults {
    op: User
    messages: Message[]
}

export interface ThreadsResponse {
    count: number
    next: string | null
    previous: string | null
    results: ThreadType[]
}

export interface SubcriptionResponse {
    count: string
    next: string | null
    previous: string | null
    results: Subscription[]
}

export interface Subscription {
    id: number
    thread: ThreadType
    watched_counter: number
}

export interface User {
    username: string
    // last_seen_online: string
    image: string 
    id: number
}

export interface MyUser {
    first_name: string
    last_name: string
    username: string
    email: string
    image: string | null
}

export interface ChatMessagePaginationResponse {
    count: number
    next: null | string
    previous: null | string
    results: ChatMessage[]
}

export interface ChatMeta {
    id: number
    thread: Chat
    watched_counter: number
}

export interface Chat {
    id: number
    last_message: ChatMessage
    user1: User
    user2: User
    counter: number
}

export interface ChatMessage {
    id: number
    owner: User 
    created_time: string
    text: string
    file: File[]
}

export interface File {
    id: number
    file: string
    message: number
}