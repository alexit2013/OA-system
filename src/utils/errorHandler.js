export const ErrorType = {
  SessionError: 'sessionError',
  ApiError: 'apiError',
};

export const handlerError = (error, dispatch) => {
  if (error.type === ErrorType.SessionError) {
    console.log('handlerApiError, redirect to login');
    dispatch({
      type: 'login/logout',
    });
    error.preventDefault();
  } else {
    console.warn('unhandler error');
  }
};
