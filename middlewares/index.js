exports.isLoggedIn = (req, res, next) => {
   //isAuthenticated 로그인 상태 시 ture 반환
   if (req.isAuthenticated()) {
      next();
   } else {
      res.status(403).send('로그인 필요');
   }
};

exports.isNotLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      next();
   } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
   }
};

exports.corsWhenDomainMatcher = async (req, res, next) => {
   const domain = await Domain.fineOne({
      where: { host: new URL(req.get('origin').host) },
   });
   if (domain) {
      cors({
         origin: req.get('origin'),
         credentials: true,
      })(req, res, next);
   } else {
      next();
   }
};
