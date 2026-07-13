"use client";

import { useState } from "react";

import TeacherRegistModal from "./TeacherRegistModal";

interface TeacherRegistMenuItemProps {
    nickName: string;
}

export default function TeacherRegistMenuItem({ nickName }: TeacherRegistMenuItemProps) {
    const [isModal, setIsModal] = useState(false);

    return (
        <TeacherRegistModal
            isModal={isModal}
            setIsModal={setIsModal}
            nickName={nickName}
        />
    );
}
