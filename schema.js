listeningSchema.pre('save', function (next) {
  if (!this.image.url || this.image.url.trim() === '') {
    this.image.url = "https://images.unsplash.com/photo-1761165308046-174a56e73525?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170";
    this.image.filename = "listing_placeholder";
  }
  next();
});