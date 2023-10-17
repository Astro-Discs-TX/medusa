import React, { useEffect, useState } from "react"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import { DatePicker } from "@medusajs/ui"
import { MEDUSA_BACKEND_URL_NOSLASH } from "../../../constants/medusa-backend-url"
import moment from "moment"

type ExportModalProps = {
  handleClose: () => void
  onSubmit?: () => void
  loading: boolean
  title: string
}

const SalesReportModal: React.FC<ExportModalProps> = ({
  handleClose,
  title,
  loading,
  onSubmit,
}) => {

    // Init dates

  let now = new Date

  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [endDate, setEndDate] = useState(now)
  const [url, setUrl] = useState('')

  // Date select

    type DateSelectType = {
        selectedDate: Date,
        setDate: any,
        filterTitle: string
    }

  const DateSelect = ({selectedDate, setDate, filterTitle}: DateSelectType) => {
          
      return(
          <DatePicker
            defaultValue={selectedDate}
            onChange={setDate}
          />
      )

  }

  // Get report

  const getUrl = () => {

      let reportUrl = MEDUSA_BACKEND_URL_NOSLASH+'/sales-report/'

      reportUrl += '?start_date='+moment(startDate).format("YYYY-MM-DD")+'T00:00:00'

      reportUrl += '&end_date='+moment(endDate).format("YYYY-MM-DD")+'T23:59:59'
      
      return reportUrl;

  }

  const getReport = () => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel="noopener noreferrer";
    link.click();
  }

  useEffect(()=>{
    setUrl(getUrl());
  },[startDate, endDate])


  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">{title}</span>
        </Modal.Header>
        <Modal.Content>
            <div className="flex flex-row items-center justify-start gap-4">
                <div className="basis-1/2">
                    <DateSelect
                        selectedDate={startDate}
                        setDate={setStartDate}
                        filterTitle="From date"
                    />
                </div>
                <div className="basis-1/2">
                    <DateSelect
                        selectedDate={endDate}
                        setDate={setEndDate}
                        filterTitle="To date"
                    />
                </div>
            </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              disabled={loading}
              variant="primary"
              size="small"
              onClick={getReport}
            >
              Get report
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default SalesReportModal
