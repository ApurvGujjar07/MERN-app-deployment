import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '30s', target: 300 },
    { duration: '30s', target: 600 },
    { duration: '30s', target: 1000 }, // real stress
  ],
};

export default function () {
  http.get('http://a6a47af1df1594fb8b98a37ba2f9d199-df34bdb82c08caf7.elb.ap-south-2.amazonaws.com/api/posts');
  sleep(0.1);
}
