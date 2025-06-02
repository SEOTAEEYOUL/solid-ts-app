import { onCleanup, onMount, createEffect } from 'solid-js';
import { createSignal } from 'solid-js';
import flatpickr from 'flatpickr';
import { Korean } from 'flatpickr/dist/l10n/ko';
import 'flatpickr/dist/themes/dark.css';

// import { SVGIcon } from './SVGIcon';
// import { SVGIconKind } from '../types/types';

interface DatePickerProps {
  value?: string;
  onChange?: (dateStr: string, dateObj: Date) => void;
}

const DatePicker = (props: DatePickerProps) => {
  let inputRef: HTMLInputElement | undefined;
  let instance: flatpickr.Instance | null = null;

  // 캘린더 오픈/토글 함수
  const openCalendar = () => {
    if (instance?.isOpen) {
      instance.close();
    } else {
      instance?.open();
    }
  };

  // 마운트 시 flatpickr 인스턴스 생성
  onMount(() => {
    if (inputRef) {
      instance = flatpickr(inputRef, {
        locale: Korean,
        dateFormat: 'Y-m-d',
        defaultDate: props.value,
        onChange: (selectedDates, dateStr) => {
          props.onChange?.(dateStr, selectedDates[0]);
        },
      });
      // 마운트 시 캘린더 자동 오픈
      instance.open();
    }
  });

  // 언마운트 시 인스턴스 해제
  onCleanup(() => {
    instance?.destroy();
  });

  // value prop이 변경될 때마다 날짜 갱신
  createEffect(() => {
    if (instance && props.value) {
      instance.setDate(props.value, false);
    }
  });

  return (
    <div class="position-relative flatpickr-container">
      <input
        type="text"
        ref={el => (inputRef = el)}
        class="input-type01"
        style={{ width: '160px' }}
      />
      {/* <button
        type="button"
        onClick={openCalendar}
        class="btn position-absolute"
        style={{ left: '112px', top: '1px' }}
      >
        <SVGIcon kind={SVGIconKind.Calendar} class="icon-white" />
      </button> */}
    </div>
  );
};

export default DatePicker;
