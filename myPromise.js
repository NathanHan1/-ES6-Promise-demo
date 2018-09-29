class myPromise {
    constructor(fn) {
        if (typeof fn !== 'function') {
            throw Error('param should be a funciton');
        }

        this.state = 'pending';
        this.data = null;
        this.resolveArr = [];
        this.rejectArr = [];

        const _this = this;
        function resolve(data) {
            _this.data = data;
            _this.state = 'resolved';
            _this.resolveArr.forEach(item => item());
        }
        function reject(err) {
            _this.data = err;
            _this.state = 'rejected';
            _this.rejectArr.forEach(item => item());
        }

        fn(resolve, reject);
    }

    then(onResolve, onReject) {
        const _this = this;
        switch (this.state) {
            case 'pending':
                return new myPromise((resolve, rejcet) => {
                    _this.resolveArr.push(() => {
                        const result = onResolve(_this.data);
                        if (result instanceof myPromise) {
                            result.then(resolve, rejcet);
                        } else {
                            resolve(result);
                        }
                    });

                    _this.rejectArr.push(() => {
                        const result = onReject(_this.data);
                        if (result instanceof myPromise) {
                            result.then(resolve, rejcet);
                        } else {
                            resolve(result);
                        }
                    });
                });
            case 'resolved':
                return new myPromise((resolve, rejcet) => {
                    const result = onResolve(_this.data);
                    if (result instanceof myPromise) {
                        result.then(resolve, rejcet);
                    } else {
                        resolve(result);
                    }
                });
            case 'rejected':
                return new myPromise((resolve, rejcet) => {
                    const result = onReject(_this.data);
                    if (result instanceof myPromise) {
                        result.then(resolve, rejcet);
                    } else {
                        resolve(result);
                    }
                });
        }
    }
}
