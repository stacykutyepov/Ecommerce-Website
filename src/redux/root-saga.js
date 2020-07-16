import { all, call } from 'redux-saga/effects';

import { shopSagas } from './shop/shop.saga';
import { userSagas } from './user/user.saga';
import { cartSagas } from './cart/cart.sagas';

export default function* rootSaga() {
    // all - allows to take different sagas concurrently
    yield all([call(shopSagas), call(userSagas), call(cartSagas)]);
}