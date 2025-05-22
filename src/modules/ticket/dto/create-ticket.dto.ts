export class CreateTicketDto {
    name: string;
    description: string;
    customerId: string;
    contactPersonName: string;
    email: string;
    phone: string;
    channel: string;
    workType: string;
    status: string;
    priority: string;
    severity: string;
    ticketClassificationId: string;
    tags: string[];
    attachments: string[];
    assignedTo: string[];

}
