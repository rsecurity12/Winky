class Notification {
    title;
    discription;
    notificationState;
    breedteLigging;
    lengteLigging;

    Notification() {}
    Notification(title, description, notificationState, breedteLigging, lengteLigging) {
        this.title = title;
        this.discription = description;
        this.notificationState = notificationState
        this.breedteLigging = breedteLigging;
        this.lengteLigging = lengteLigging;
    };
    Notification(title, description, notificationState) {
        this.title = title;
        this.discription = description;
        this.notificationState = notificationState
    };

    // getters and setters
    get title() { return this.title; }
    set title(value) { this.title = value; }
    get description() { return this.discription; }
    set description(value) { this.discription = value; }
}
module.exports = Notification;