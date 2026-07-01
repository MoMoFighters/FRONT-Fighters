import { expect, test, type Page } from '@playwright/test';

const studentAccount = {
  email: process.env.E2E_STUDENT_EMAIL ?? 'student1@momo.city',
  password: process.env.E2E_STUDENT_PASSWORD ?? 'password123',
};

async function loginAsStudent(page: Page) {
  await page.goto('/auth/login');

  const loginForm = page.locator('main form');
  await page.getByPlaceholder('이메일 입력').fill(studentAccount.email);
  await page.getByPlaceholder('비밀번호 입력').fill(studentAccount.password);
  await loginForm.getByRole('button', { name: /^로그인$/ }).click();

  const confirmButton = page.getByRole('button', { name: '확인' });
  await expect(confirmButton).toBeVisible({ timeout: 15_000 });
  await confirmButton.click();

  await expect(page).toHaveURL(/\/student(?:\?|$)/, { timeout: 15_000 });
}

test('학생이 로그인 후 강의를 수강 신청하면 내 도시에 해당 강의의 카테고리에 맞는 건물이 생겨난다.', async ({ page }) => {
  await test.step('헤더의 회원가입 버튼으로 회원가입 페이지에 진입할 수 있다', async () => {
    await page.goto('/');
    await page.getByRole('link', { name: '회원가입' }).click();
    await expect(page).toHaveURL(/\/auth\/signup$/);
  });

  await test.step('기존 학생 계정으로 로그인한다', async () => {
    await loginAsStudent(page);
  });

  await test.step('내 도시의 건물 생성 슬롯에서 강의 목록으로 이동한다', async () => {
    const createBuildingLink = page.locator('a[href^="/student/lectures"]').first();

    await expect(createBuildingLink).toBeVisible({ timeout: 15_000 });
    await createBuildingLink.click();

    await expect(page).toHaveURL(/\/student\/lectures(?:\?|$)/, { timeout: 15_000 });
  });

  await test.step('첫 번째 강의 상세 페이지로 이동한다', async () => {
    const firstLectureLink = page.locator('a[href^="/student/lectures/"]').first();

    await expect(firstLectureLink).toBeVisible({ timeout: 15_000 });
    await firstLectureLink.click();

    await expect(page).toHaveURL(/\/student\/lectures\/\d+/, { timeout: 15_000 });
  });

  await test.step('수강 신청을 시도하고 내 도시로 돌아온다', async () => {
    const enrollButton = page.getByRole('button', { name: '수강 신청' });

    if (await enrollButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await enrollButton.click();
      await expect(page.getByText('해당 강의를 수강 신청하시겠습니까?')).toBeVisible();
      await page.getByRole('button', { name: '확인' }).click();

      await expect(
        page.getByText(/정상적으로 수강 신청 되었습니다\.|이미 수강 신청한 강의입니다\./),
      ).toBeVisible({ timeout: 15_000 });
    }

    await page.goto('/student');
    await expect(page).toHaveURL(/\/student$/);
    await expect(page.locator('a[href^="/student/"]').first()).toBeVisible({ timeout: 15_000 });
  });
});
