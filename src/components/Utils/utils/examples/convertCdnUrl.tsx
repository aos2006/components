import * as React from 'react';
import { observer } from 'mobx-react';
import axios from "axios";

interface IConvertCdnUrlProps {

}

@observer
export default class ConvertCdnUrl extends React.Component<IConvertCdnUrlProps> {


  componentDidMount(): void {

    axios(
      {
        baseURL:"http://localhost:8060",
        url: "/v1/assets/",
        method: 'get',
        params: {
          activePage: 1,
          limit: 200
        }
      }
    ).then(data => {
      debugger;
        console.log(`!!!! convertCdnUrl.tsx:25 \n data `, data, '\n !!!!');
      }
    ).catch(error => {
      debugger;
      console.log(`!!!! convertCdnUrl.tsx:28 \n error `, error, '\n !!!!');
    })
  }

  render() {
    return <div>

      fuck

    </div>
  }

}
