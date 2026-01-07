import dayjs from 'dayjs';

/**
 * 格式化日期时间
 * @param {string|Date|number} dateTime - 日期时间
 * @returns {string} 格式化后的日期时间字符串 "YYYY-MM-DD HH:mm:ss"
 */
export const formatDateTime = (dateTime) => {
  return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
};
