import { Button, Select } from '@grafana/ui';
import React from 'react';
import { EditorRow } from './../../components/extended/EditorRow';
import { EditorField } from './../../components/extended/EditorField';
import { filterOperators } from './../../app/parsers/filter';
import { isDataQuery } from './../../app/utils';
import { FilterOperator } from './../../constants';
import type { InfinityFilter, InfinityQuery } from './../../types';
import type { SelectableValue } from '@grafana/data/types';

export const TableFilter = (props: { query: InfinityQuery; onChange: (value: any) => void; onRunQuery: any }) => {
  const { query, onChange } = props;
  if (!isDataQuery(query)) {
    return <></>;
  }
  const getFields = () => {
    return query.columns.map((col, index) => {
      return {
        label: col.text || col.selector || `column ${0 + index}`,
        value: col.text || col.selector,
      };
    });
  };
  const addFilter = () => {
    let filters = [...(query.filters || [])];
    let newFilter: InfinityFilter = {
      field: query.columns && query.columns.length > 0 ? query.columns[0].text : '',
      operator: FilterOperator.Equals,
      value: [''],
    };
    filters.push(newFilter);
    onChange({ ...query, filters });
  };
  const removeFilter = (index: number) => {
    const filters = [...(query.filters || [])];
    filters.splice(index, 1);
    onChange({ ...query, filters });
  };
  const onFilterFieldChange = (index: number, value: SelectableValue) => {
    const filters = [...(query.filters || [])];
    filters[index].field = value.value;
    onChange({ ...query, filters });
  };
  const onFilterOperatorChange = (index: number, value: SelectableValue) => {
    query.filters = query.filters || [];
    query.filters[index].operator = value.value;
    onChange(query);
  };
  const onFilterValueChange = (index: number, valueIndex: number, value: string) => {
    query.filters = query.filters || [];
    query.filters[index].value[valueIndex] = value;
    onChange(query);
  };
  return (
    <EditorRow label="Results Filter" collapsible={true} collapsed={false} title={() => `${(query?.filters || [])?.length} Filters`}>
      <EditorField label={`Results Filter`}>
        <>
          {query.filters && query.filters.length > 0 ? (
            <>
              {query.filters.map((filter, index) => (
                <div className="gf-form-inline" key={index}>
                  <label className="gf-form-label width-6">Filter {index + 1}</label>
                  <Select
                    className="width-8"
                    options={getFields()}
                    defaultValue={getFields()[0]}
                    value={getFields().find((f) => f.value === filter.field) || getFields()[0]}
                    onChange={(e) => onFilterFieldChange(index, e)}
                    menuShouldPortal={true}
                  ></Select>
                  <Select
                    className="width-8"
                    options={filterOperators}
                    defaultValue={filterOperators[0]}
                    value={filterOperators.find((f) => f.value === filter.operator) || filterOperators[0]}
                    onChange={(e) => onFilterOperatorChange(index, e)}
                    menuShouldPortal={true}
                  ></Select>
                  <input
                    type="text"
                    className="gf-form-input min-width-10 width-10"
                    value={filter.value[0]}
                    onChange={(e) => onFilterValueChange(index, 0, e.target.value)}
                    placeholder="Value"
                  ></input>
                  <span
                    className="btn btn-danger btn-small"
                    style={{ margin: '5px' }}
                    onClick={() => {
                      removeFilter(index);
                    }}
                  >
                    x
                  </span>
                  <br />
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
          <Button
            variant="secondary"
            size="sm"
            style={{ marginTop: '5px', marginRight: '10px' }}
            onClick={(e) => {
              addFilter();
              e.preventDefault();
            }}
          >
            Add filter
          </Button>
        </>
      </EditorField>
    </EditorRow>
  );
};
