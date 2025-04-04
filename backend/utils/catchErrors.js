const catchErrors = async (controller) => {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch((err) => next(err));
  };
};

export default catchErrors;
