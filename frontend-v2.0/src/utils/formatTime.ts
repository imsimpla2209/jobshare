import { format } from 'date-fns'

export default function formatTime(time: string) {
  return format(new Date(time), 'H:mm, MMM d, yyyy')
}
