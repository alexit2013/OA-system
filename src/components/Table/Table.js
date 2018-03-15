import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';

class Tables extends React.Component {
  static propTypes = {
    cbKeys: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    type: PropTypes.string,
    scroll: PropTypes.object,
    onRow: PropTypes.func,
    bordered: PropTypes.bool,
    expandedRowRender: PropTypes.func,
    className: PropTypes.string,
    rowKey: PropTypes.func,
    onExpand: PropTypes.func,
    pagination: PropTypes.bool,
  }
  static defaultProps = {
    loading: false,
    type: 'checkbox',
    scroll: {},
    onRow: null,
    bordered: false,
    expandedRowRender: null,
    className: '',
    rowKey: null,
    onExpand: null,
    pagination: true,
  }
  state = {
    selectedRowKeys: [], // Check here to configure the default column
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
    this.props.cbKeys(selectedRowKeys);
  }
  render() {
    const {columns, dataSource, cbKeys, loading, scroll, bordered, expandedRowRender, className, type, onRow, rowKey, onExpand, pagination} = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      type: this.props.type,
      selections: [{
        key: 'all-data',
        text: '全选',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index < 0) {
              return false;
            }
            return true;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
          cbKeys(newSelectedRowKeys);
        },
      }, {
        key: 'invert',
        text: '反选',
        onSelect: (changableRowKeys) => {
          const newSelectedRowKeys = [];
          if (selectedRowKeys.length === 0) {
            this.setState({selectedRowKeys: changableRowKeys});
          } else {
            for (let i = 0; i < changableRowKeys.length; i += 1) {
              let flag = false;
              let temp;
              for (let j = 0; j < selectedRowKeys.length; j += 1) {
                if (changableRowKeys[i] !== selectedRowKeys[j]) {
                  flag = true;
                  temp = changableRowKeys[i];
                } else {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                newSelectedRowKeys.push(temp);
              }
            }
            this.setState({selectedRowKeys: newSelectedRowKeys});
          }
        },
      }, {
        key: 'no-data',
        text: '取消选择',
        onSelect: () => {
          this.setState({ selectedRowKeys: [] });
        },
      }],
      onSelection: this.onSelection,
    };
    return (
      <Table pagination={pagination} className={className} type={type} rowSelection={rowSelection} columns={columns} dataSource={dataSource} loading={loading} scroll={scroll} bordered={bordered} expandedRowRender={expandedRowRender} onRow={onRow} rowKey={rowKey} onExpand={onExpand}/>
    );
  }
}
export default Tables;
