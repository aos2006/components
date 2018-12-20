import React from 'react';
import { observer } from 'mobx-react';
import styles from './DynamicBlocks.styl';
import { Icon, Card, Button } from 'antd';

export interface IDataBlock {
  index: number;
  idPrefix: string;
  allData: any;
  editRecord?: any;
}

export interface IDynamicBlock {
  idPrefix: string;
  renderBlock: React.ComponentClass<IDataBlock>;
  deleteFirst?: boolean;
  data: any[];
  addText?: string;
  blockTitle?: string;
  dataModel: any;
  itemProps: any;
}

@observer
export default class DynamicBlocks extends React.Component<IDynamicBlock> {
  render() {
    const {
      idPrefix,
      renderBlock: DataBlock,
      deleteFirst = false,
      data,
      addText = '',
      dataModel,
      itemProps,
    } = this.props;

    return (
      <div className={styles.dynamicBlocksContainer}>
        {data.length ? (
          data.map((record, index) => {
            const CloseButton =
              index || deleteFirst ? (
                <Icon
                  type="close"
                  style={{ fontSize: 20, color: 'black' }}
                  onClick={e => {
                    e.preventDefault();
                    data.splice(index, 1);
                  }}
                />
              ) : null;

            return (
              <Card key={index} extra={CloseButton} className={styles.fieldsContainer}>
                <DataBlock index={index} idPrefix={idPrefix} {...itemProps} />
              </Card>
            );
          })
        ) : (
          <div className={styles.noData}>No members</div>
        )}
        <div className={styles.footer}>
          <Button
            type="primary"
            className={styles.addButton}
            onClick={e => {
              e.preventDefault();

              data.push(dataModel);
            }}
          >
            <Icon type="plus" style={{ fontSize: 20, color: 'white' }} />
            {addText}
          </Button>
        </div>
      </div>
    );
  }
}
