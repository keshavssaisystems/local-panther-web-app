export const addCommonAsyncHandlers = (builder, thunk) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.error = null;
      state.loading = true;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      // Optional: handle success logic if common
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message || "Something went wrong";
    });
};