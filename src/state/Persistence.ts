import { useRecoilTransactionObserver_UNSTABLE } from 'recoil';


export function PersistenceObserver() {
  useRecoilTransactionObserver_UNSTABLE(({
    snapshot,
    previousSnapshot
  }) => {
    // console.log(snapshot);
  });
  
  return null
}



