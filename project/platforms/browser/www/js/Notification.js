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
    // Tijdelijk
    Notification(title, description, notificationState) {
        this.title = title;
        this.discription = description;
        this.notificationState = notificationState
        this.breedteLigging = breedteLigging;
        this.lengteLigging = lengteLigging;
    };
    // getters and setters
    get title() { return this.title; }
    set title(value) { this.title = value; }
    get description() { return this.discription; }
    set description(value) { this.discription = value; }
    get notificationState() { return this.notificationState }
    set notificationState(value) { this.notificationState = value; }
    get breedteLigging() { return this.breedteLigging }
    set breedteLigging(value) { this.breedteLigging }
}
export { Notification };