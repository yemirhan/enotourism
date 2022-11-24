import { Modal } from '@mantine/core'
import React from 'react'

export const CreateWineModal = ({ opened, setClosed }: { opened: boolean, setClosed: () => void }) => {
    return (
        <Modal
            opened={opened}
            onClose={setClosed}
            title='Create Wine'
        >
            
        </Modal>
    )
}
