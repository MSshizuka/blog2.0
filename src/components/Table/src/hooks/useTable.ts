import type { BasicTableProps, TableActionType, FetchParams, BasicColumn } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import type { DynamicProps } from '/#/utils';
import type { FormActionType } from '/@/components/Form';
import type { WatchStopHandle } from 'vue';
import { getDynamicProps } from '/@/utils';
import { ref, onUnmounted, unref, watch, toRaw } from 'vue';
import { isProdMode } from '/@/utils/env';
import { error } from '/@/utils/log';

type Props = Partial<DynamicProps<BasicTableProps>>; // 值可能包装成ref和computedRef 键可选

type UseTableMethod = TableActionType & {
  getForm: () => FormActionType;
};

/**
 *
 * @param tableProps 关于表格的所有基本属性
 * @returns 返回值为元组
 *           第一个为注册函数
 *           第二个是table方法集
 */
export function useTable(tableProps?: Props): [
  /* instance 表格实例  formInstance 表单实例 包含表格实例的所有属性方法 */
  (instance: TableActionType, formInstance: UseTableMethod) => void,
  /* 所有表格和表单组成的方法集对象 方便解构 */
  TableActionType & {
    getForm: () => FormActionType;
  },
] {
  const tableRef = ref<Nullable<TableActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);
  const formRef = ref<Nullable<UseTableMethod>>(null);

  let stopWatch: WatchStopHandle;

  function register(instance: TableActionType, formInstance: UseTableMethod) {
    /* 线上模式挂载释放 */
    isProdMode() &&
      onUnmounted(() => {
        tableRef.value = null;
        loadedRef.value = null;
      });

    /* 表格初始化完毕 */
    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) return;

    tableRef.value = instance;
    formRef.value = formInstance;
    /* setProps  设置表格基本属性 */
    tableProps && instance.setProps(getDynamicProps(tableProps));
    loadedRef.value = true; // 表格设置完毕

    stopWatch?.(); // 停止监听函数存在则执行

    stopWatch = watch(
      // 开始监听
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps));
      },
      {
        immediate: true,
        deep: true,
      },
    );
  }

  /* 获取表格的实例 */
  function getTableInstance(): TableActionType {
    const table = unref(tableRef);
    if (!table) {
      error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!',
      );
    }
    return table as TableActionType;
  }

  /* 表格方法集合 */
  const methods: TableActionType & {
    getForm: () => FormActionType;
  } = {
    reload: async (opt?: FetchParams) => {
      return await getTableInstance().reload(opt);
    },
    setProps: (props: Partial<BasicTableProps>) => {
      getTableInstance().setProps(props);
    },
    redoHeight: () => {
      getTableInstance().redoHeight();
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading);
    },
    getDataSource: () => {
      return getTableInstance().getDataSource();
    },
    getRawDataSource: () => {
      return getTableInstance().getRawDataSource();
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      const columns = getTableInstance().getColumns({ ignoreIndex }) || [];
      return toRaw(columns);
    },
    setColumns: (columns: BasicColumn[]) => {
      getTableInstance().setColumns(columns);
    },
    setTableData: (values: any[]) => {
      return getTableInstance().setTableData(values);
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return getTableInstance().setPagination(info);
    },
    deleteSelectRowByKey: (key: string) => {
      getTableInstance().deleteSelectRowByKey(key);
    },
    getSelectRowKeys: () => {
      return toRaw(getTableInstance().getSelectRowKeys());
    },
    getSelectRows: () => {
      return toRaw(getTableInstance().getSelectRows());
    },
    clearSelectedRowKeys: () => {
      getTableInstance().clearSelectedRowKeys();
    },
    setSelectedRowKeys: (keys: string[] | number[]) => {
      getTableInstance().setSelectedRowKeys(keys);
    },
    getPaginationRef: () => {
      return getTableInstance().getPaginationRef();
    },
    getSize: () => {
      return toRaw(getTableInstance().getSize());
    },
    updateTableData: (index: number, key: string, value: any) => {
      return getTableInstance().updateTableData(index, key, value);
    },
    deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => {
      return getTableInstance().deleteTableDataRecord(rowKey);
    },
    insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => {
      return getTableInstance().insertTableDataRecord(record, index);
    },
    updateTableDataRecord: (rowKey: string | number, record: Recordable) => {
      return getTableInstance().updateTableDataRecord(rowKey, record);
    },
    findTableDataRecord: (rowKey: string | number) => {
      return getTableInstance().findTableDataRecord(rowKey);
    },
    getRowSelection: () => {
      return toRaw(getTableInstance().getRowSelection());
    },
    getCacheColumns: () => {
      return toRaw(getTableInstance().getCacheColumns());
    },
    getForm: () => {
      return unref(formRef) as unknown as FormActionType;
    },
    setShowPagination: async (show: boolean) => {
      getTableInstance().setShowPagination(show);
    },
    getShowPagination: () => {
      return toRaw(getTableInstance().getShowPagination());
    },
    expandAll: () => {
      getTableInstance().expandAll();
    },
    expandRows: (keys: string[]) => {
      getTableInstance().expandRows(keys);
    },
    collapseAll: () => {
      getTableInstance().collapseAll();
    },
    scrollTo: (pos: string) => {
      getTableInstance().scrollTo(pos);
    },
  };

  return [register, methods];
}
